const requestService = require('../services/requestService');

const getRequests = (req, res) => {
    try {
        const filters = req.query; // { status, executorId, department, overdue }
        const requests = requestService.getRequests(filters);
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createRequest = (req, res) => {
    try {
        const data = req.body;
        const newRequest = requestService.createRequest(data);
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateStatus = (req, res) => {
    try {
        const requestId = Number(req.params.id);
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Поле status обязательно' });
        }
        const updated = requestService.updateStatus(requestId, status);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateExecutor = (req, res) => {
    try {
        const requestId = Number(req.params.id);
        const { executorId } = req.body;
        if (!executorId) {
            return res.status(400).json({ error: 'Поле executorId обязательно' });
        }
        const updated = requestService.updateExecutor(requestId, Number(executorId));
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getReports = (req, res) => {
    try {
        const report = requestService.getReports();
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRequests,
    createRequest,
    updateStatus,
    updateExecutor,
    getReports,
};