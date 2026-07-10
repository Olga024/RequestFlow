const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.get('/', requestController.getRequests);

router.post('/', requestController.createRequest);

router.patch('/:id/status', requestController.updateStatus);

router.patch('/:id/executor', requestController.updateExecutor);

router.get('/reports', requestController.getReports);

module.exports = router;