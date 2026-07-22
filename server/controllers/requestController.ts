import { Request, Response } from 'express';
import * as requestService from '../services/issuesService';

export const getRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const { filters, order, pageSize, startFrom } = req.query;
        const requests = await requestService.getIssuesList({
            filters,
            order,
            pagination: { pageSize, startFrom }
        } as any);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const createRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body;
        const newRequest = await requestService.createIssue(data);
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestId = Number(req.params.id);
        const { status } = req.body;
        if (!status) {
            res.status(400).json({ error: 'Поле status обязательно' });
            return;
        }
        const updated = await requestService.updateStatus(requestId, status);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const updateExecutor = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestId = Number(req.params.id);
        const { executorId } = req.body;
        if (!executorId) {
            res.status(400).json({ error: 'Поле executorId обязательно' });
            return;
        }
        const updated = await requestService.updateExecutor(requestId, Number(executorId));
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};