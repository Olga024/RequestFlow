import pool from '../config/db';
import { TEmployee } from '../types/common';

export const getAllEmployees = () => new Promise<TEmployee[]>((resolve, reject) => {
  pool.connect()
    .then((client) => {
      client.query<TEmployee>(`SELECT * FROM requestflow_schema.employees ORDER BY id ASC `)
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

export const getEmployeeById = (id: number) => new Promise<TEmployee | undefined>((resolve, reject) => {
  pool.connect()
    .then((client) => {
      client.query<TEmployee>(`SELECT * FROM requestflow_schema.employees WHERE id = '${id}' `)
        .then((result) => {
          resolve(result.rows[0]);
        })
        .catch(reject)
        .finally(() => {
          client.release();
        })
    })
    .catch(reject);
});