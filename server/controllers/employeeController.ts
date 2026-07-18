import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService';

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};