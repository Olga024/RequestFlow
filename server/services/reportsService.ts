import pool from '../config/db';
import { TIssueStatus, TReport } from '../types/common';

export const getReports = (): Promise<TReport> => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(async (client) => {
                try {
                    const statusResult = await client.query(
                        `SELECT status, COUNT(*) as count 
                         FROM requestflow_schema.issues 
                         GROUP BY status`
                    );
                    const statusCounts: Record<TIssueStatus, number> = {
                        new: 0,
                        in_progress: 0,
                        done: 0,
                    };
                    statusResult.rows.forEach(row => {
                        if (row.status in statusCounts) {
                            statusCounts[row.status as TIssueStatus] = Number(row.count);
                        }
                    });
                    const totalResult = await client.query(
                        `SELECT COUNT(*) as total FROM requestflow_schema.issues`
                    );
                    const total = Number(totalResult.rows[0].total);

                    const overdueResult = await client.query(
                        `SELECT COUNT(*) as overdue 
                         FROM requestflow_schema.issues 
                         WHERE deadline < NOW() AND status != 'done'`
                    );
                    const overdue = Number(overdueResult.rows[0].overdue);
                    const doneByExecutorResult = await client.query(
                        `SELECT e.full_name, COUNT(*) as count 
                         FROM requestflow_schema.issues i
                         JOIN requestflow_schema.employees e ON i.executor_id = e.id
                         WHERE i.status = 'done'
                         GROUP BY e.full_name`
                    );
                    const doneByExecutor: Record<string, number> = {};
                    doneByExecutorResult.rows.forEach(row => {
                        doneByExecutor[row.full_name] = Number(row.count);
                    });

                    resolve({
                        total,
                        statusCounts,
                        overdue,
                        doneByExecutor,
                    });
                } catch (err) {
                    reject(err);
                } finally {
                    client.release();
                }
            })
            .catch(reject);
    });
};