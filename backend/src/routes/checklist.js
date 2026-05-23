import { Router } from 'express';
import * as checklistController from '../controllers/checklistController.js';
import { validate } from '../middleware/validate.js';
import { createChecklistSchema, updateChecklistSchema } from '../validators/checklist.js';

const router = Router();

router.post('/cards/:id/checklist', validate(createChecklistSchema), checklistController.createItem);
router.patch('/checklist-items/:id', validate(updateChecklistSchema), checklistController.updateItem);
router.delete('/checklist-items/:id', checklistController.deleteItem);

export default router;
