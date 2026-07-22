import pool from '../config/db';
import { TIssue, TIssuesFilters, TIssueStatus, TNewIssueData, TPagination } from '../types/common';
import { getEmployeeById } from './employeeService';

const allowedStatusTransitions: Record<TIssueStatus, TIssueStatus[]> = {
    new: ['in_progress'],
    in_progress: ['done'],
    done: [],
};

export const getIssuesList = ({
    order = 'ASC',
    filters = {},
    pagination = {
        pageSize: 50,
        startFrom: 0,
    }
}: {
    filters?: TIssuesFilters,
    order?: 'ASC' | 'DESC',
    pagination?: TPagination
}) => new Promise<TIssue[]>((resolve, reject) => {
    pool.connect()
        .then((client) => {
            let sql = `
                SELECT 
                    i.id,
                    i.number,
                    i.created_at AS "createdAt",
                    i.author_id AS "authorId",
                    i.executor_id AS "executorId",
                    i.description,
                    i.deadline,
                    i.status
                FROM requestflow_schema.issues i 
            `;
            //console.log({sql})
            const conditions: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (filters.status) {
                conditions.push(`i.status = $${paramIndex++}`);
                values.push(filters.status);
            }
            if (filters.executorId) {
                conditions.push(`i.executor_id = $${paramIndex++}`);
                values.push(filters.executorId);
            }
            if (filters.department) {
                sql += ` JOIN requestflow_schema.employees e ON i.executor_id = e.id`;
                conditions.push(`e.department = $${paramIndex++}`);
                values.push(filters.department);
            }
            if (filters.overdue === 'true') {
                conditions.push(`i.deadline < NOW() AND i.status != 'done'`);
            }
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }
            sql += ` ORDER BY i.id ${order} LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
            values.push(pagination.pageSize, pagination.startFrom * pagination.pageSize);

            client.query<TIssue>(sql, values)
                .then((result) => {
                    resolve(result.rows);
                })
                .catch(reject)
                .finally(() => client.release());
        })
        .catch(reject);
});

export const getIssueById = (issueId: number) => new Promise<TIssue>((resolve, reject) => {
    pool.connect()
        .then((client) => {
            client.query<TIssue>(`
    SELECT 
        id,
        number,
        created_at AS "createdAt",
        author_id AS "authorId",
        executor_id AS "executorId",
        description,
        deadline,
        status
    FROM requestflow_schema.issues WHERE id = $1
`, [issueId])
                .then(({ rows: [issue] }) => {
                    if (!issue) {
                        throw new Error('Заявка не найдена');
                    }
                    resolve(issue);
                })
                .catch(reject)
                .finally(() => {
                    client.release();
                })
        })
        .catch(reject);
});

export const createIssue = (data: TNewIssueData) => new Promise<TIssue>((resolve, reject) => {
    Promise.all([
        getEmployeeById(data.authorId),
        getEmployeeById(data.executorId),
    ])
        .then(([author, executor]) => {
            if (!author) throw new Error('Автор не найден');
            if (!executor) throw new Error('Исполнитель не найден');
            // Уникальный номер с временной меткой и случайной частью
            const issueNumber = `ISSUE-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
            pool.connect()
                .then((client) => {
                    client.query(
                        `
                        INSERT INTO requestflow_schema.issues (number, author_id, executor_id, description, deadline, status)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        ON CONFLICT (number) DO NOTHING
                        RETURNING 
                            id,
                            number,
                            created_at AS "createdAt",
                            author_id AS "authorId",
                            executor_id AS "executorId",
                            description,
                            deadline,
                            status
                        `,
                        [issueNumber, author.id, executor.id, data.description, data.deadline, 'new']
                    )
                        .then((result) => {
                            if (result.rows.length === 0) {
                                throw new Error('Не удалось создать заявку (возможно, дубликат номера)');
                            }
                            resolve(result.rows[0]); // возвращаем объект TIssue
                        })
                        .catch(reject)
                        .finally(() => {
                            client.release();
                        });
                })
                .catch(reject);
        })
        .catch(reject);
});

export const updateStatus = (issueId: number, newStatus: TIssueStatus) => new Promise<TIssue>((resolve, reject) => {
    getIssueById(issueId)
        .then((issue) => {
            const currentStatus = issue.status;
            const allowed = allowedStatusTransitions[currentStatus] || [];
            if (!allowed.includes(newStatus)) {
                throw new Error(`Недопустимый переход статуса: из "${currentStatus}" в "${newStatus}"`);
            }
            pool.connect()
                .then((client) => {
                    client.query(
                        `
                        UPDATE requestflow_schema.issues 
                        SET status = $1 
                        WHERE id = $2 
                        RETURNING 
                            id,
                            number,
                            created_at AS "createdAt",
                            author_id AS "authorId",
                            executor_id AS "executorId",
                            description,
                            deadline,
                            status
                        `,
                        [newStatus, issueId]
                    )
                        .then(({ rows }) => {
                            if (rows.length === 0) {
                                throw new Error('Заявка не найдена');
                            }
                            resolve(rows[0]);
                        })
                        .catch(reject)
                        .finally(() => {
                            client.release();
                        });
                })
                .catch(reject);
        })
        .catch(reject);
});

export const updateExecutor = (issueId: number, newExecutorId: number) => new Promise<TIssue>((resolve, reject) => {
    Promise.all([
        getIssueById(issueId),
        getEmployeeById(newExecutorId),
    ])
        .then(([issue, executor]) => {
            if (!issue) throw new Error('Заявка не найдена');
            if (!executor) throw new Error('Исполнитель не найден');
            if (issue.status === 'done') {
                throw new Error('Нельзя изменить исполнителя выполненной заявки');
            }

            pool.connect()
                .then((client) => {
                    client.query(
                        `
                        UPDATE requestflow_schema.issues 
                        SET executor_id = $1 
                        WHERE id = $2 
                        RETURNING 
                            id,
                            number,
                            created_at AS "createdAt",
                            author_id AS "authorId",
                            executor_id AS "executorId",
                            description,
                            deadline,
                            status
                        `,
                        [newExecutorId, issueId]
                    )
                        .then(({ rows }) => {
                            if (rows.length === 0) {
                                throw new Error('Заявка не найдена');
                            }
                            resolve(rows[0]);
                        })
                        .catch(reject)
                        .finally(() => {
                            client.release();
                        });
                })
                .catch(reject);
        })
        .catch(reject);
});