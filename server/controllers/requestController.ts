import { Request, Response } from 'express';
import * as requestService from '../services/issuesService';

export const getRequests = (req: Request, res: Response): void => {
    try {
        const { filters, order, pagination } = req.query;
        const requests = requestService.getIssuesList({ filters, order, pagination } as any);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const createRequest = (req: Request, res: Response): void => {
    try {
        const data = req.body;
        const newRequest = requestService.createIssue(data);
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const updateStatus = (req: Request, res: Response): void => {
    try {
        const requestId = Number(req.params.id);
        const { status } = req.body;
        if (!status) {
            res.status(400).json({ error: 'Поле status обязательно' });
            return;
        }
        const updated = requestService.updateStatus(requestId, status);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const updateExecutor = (req: Request, res: Response): void => {
    try {
        const requestId = Number(req.params.id);
        const { executorId } = req.body;
        if (!executorId) {
            res.status(400).json({ error: 'Поле executorId обязательно' });
            return;
        }
        const updated = requestService.updateExecutor(requestId, Number(executorId));
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};