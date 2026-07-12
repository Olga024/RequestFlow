import { Request, Response } from 'express';
import * as employeeService from '../services/employeeService';

export const getAllEmployees = (req: Request, res: Response): void => {
  try {
    const employees = employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};