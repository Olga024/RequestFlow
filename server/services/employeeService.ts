import pool from '../config/db';
import { TEmployee } from '../types/common';

export const getAllEmployees = async (): Promise<TEmployee[]> => {
  const result = await pool.query<TEmployee>(`
      SELECT * FROM requestflow_schema.employees ORDER BY id ASC
      `);
  return result.rows;
};

export const getEmployeeById = async (id: number): Promise<TEmployee | undefined> => {
  const result = await pool.query<TEmployee>(`
      SELECT * FROM requestflow_schema.employees WHERE id = $1
      `, [id]);
  return result.rows[0];
};