import { Router } from 'express';
import * as inboxController from '../controllers/inboxController.js';
import { validate } from '../middleware/validate.js';
import { createInboxSchema, updateInboxSchema } from '../validators/inbox.js';

const router = Router();

router.get('/', inboxController.getInbox);
router.post('/', validate(createInboxSchema), inboxController.createInbox);
router.patch('/:id', validate(updateInboxSchema), inboxController.updateInbox);
router.delete('/:id', inboxController.deleteInbox);

export default router;
