import { Router } from 'express';
import * as membersController from '../controllers/membersController.js';

const router = Router();

router.get('/', membersController.getMembers);

export default router;
