import { Router } from 'express';
import {
    getRequests,
    createRequest,
    updateStatus,
    updateExecutor,
} from '../controllers/requestController';

const router = Router();

router.get('/', getRequests);
router.post('/', createRequest);
router.patch('/:id/status', updateStatus);
router.patch('/:id/executor', updateExecutor);

export default router;