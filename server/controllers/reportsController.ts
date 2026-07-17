import { Request, Response } from 'express';
import * as reportsService from '../services/reportsService';

export const getReports = (req: Request, res: Response): void => {
    try {
        const report = reportsService.getReports();
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};