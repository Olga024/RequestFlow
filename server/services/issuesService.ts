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
    filters,
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
            client.query<TIssue>(`
                SELECT * FROM requestflow_schema.issues 
                ORDER BY id ${order} 
                LIMIT ${pagination.pageSize} OFFSET ${pagination.startFrom * pagination.pageSize}
            `)
                .then((result) => {
                    resolve(result.rows);
                })
                .catch(reject)
                .finally(() => {
                    client.release();
                })
        })
        .catch(reject);
});

export const getIssueById = (issueId: number) => new Promise<TIssue>((resolve, reject) => {
    pool.connect()
        .then((client) => {
            client.query<TIssue>(`SELECT * FROM requestflow_schema.issues WHERE id = $1`, [issueId])
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

export const createIssue = (data: TNewIssueData) => new Promise((resolve, reject) => {
    Promise.all([
        getEmployeeById(data.authorId),
        getEmployeeById(data.executorId),
    ])
        .then(([author, executor]) => {
            if (!author) throw new Error('Автор не найден');
            if (!executor) throw new Error('Исполнитель не найден');
            const issueNumber = `ISSUE-${Date.now()}`;
            pool.connect()
                .then((client) => {
                    client.query(`
                        INSERT INTO requestflow_schema.issues (number, author_id, executor_id, description, deadline, status)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        ON CONFLICT (number) DO NOTHING
                    `, [issueNumber, author.id, executor.id, data.description, data.deadline, 'new'])
                        .then((result) => {
                            resolve(result.rows);
                        })
                        .catch(reject)
                        .finally(() => {
                            client.release();
                        })
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
                        `UPDATE requestflow_schema.issues SET status = $1 WHERE id = $2 RETURNING *`,
                        [newStatus, issueId]
                    )
                        .then(({ rows: [issueUpdated] }) => {
                            if (!issueUpdated) {
                                throw new Error('Заявка не найдена');
                            }
                            resolve(issueUpdated);
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

export const updateExecutor = (issueId: number, newExecutorId: number) => new Promise((resolve, reject) => {
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
                        `UPDATE requestflow_schema.issues SET executor_id = $1 WHERE id = $2 RETURNING *`,
                        [newExecutorId, issueId]
                    )
                        .then(({ rows: [issueUpdated] }) => {
                            resolve(issueUpdated);
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