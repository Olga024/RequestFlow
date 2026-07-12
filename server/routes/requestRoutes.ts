import { Router } from 'express';
import {
    getRequests,
    createRequest,
    updateStatus,
    updateExecutor,
    getReports,
} from '../controllers/requestController';

const router = Router();

router.get('/', getRequests);
router.post('/', createRequest);
router.patch('/:id/status', updateStatus);
router.patch('/:id/executor', updateExecutor);
router.get('/reports', getReports);

export default router;