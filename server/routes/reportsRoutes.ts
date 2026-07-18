import { Router } from "express";
import { getReports } from "../services/reportsService";

const router = Router();

router.get('/', getReports);

export default router;