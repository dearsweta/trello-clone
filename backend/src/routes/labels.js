import { Router } from 'express';
import * as labelsController from '../controllers/labelsController.js';

const router = Router();

router.get('/', labelsController.getLabels);

export default router;
