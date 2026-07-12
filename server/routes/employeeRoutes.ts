import { Router } from 'express';
import { getAllEmployees } from '../controllers/employeeController';

const router = Router();

router.get('/', getAllEmployees);

export default router;