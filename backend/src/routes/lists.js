import { Router } from 'express';
import * as listsController from '../controllers/listsController.js';
import { validate } from '../middleware/validate.js';
import { createListSchema, updateListSchema, reorderListSchema } from '../validators/lists.js';

const router = Router();

router.post('/', validate(createListSchema), listsController.createList);
router.patch('/reorder', validate(reorderListSchema), listsController.reorderList);
router.patch('/:id', validate(updateListSchema), listsController.updateList);
router.delete('/:id', listsController.deleteList);

export default router;
