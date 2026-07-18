import { Request, Response } from 'express';
import * as reportsService from '../services/reportsService';

export const getReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const report = await reportsService.getReports();
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};