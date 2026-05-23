import { Router } from 'express';
import * as cardsController from '../controllers/cardsController.js';
import { validate } from '../middleware/validate.js';
import {
  createCardSchema,
  updateCardSchema,
  archiveCardSchema,
  moveCardSchema,
  reorderCardSchema,
  replaceMemberIdsSchema,
  replaceLabelIdsSchema,
} from '../validators/cards.js';

const router = Router();

router.post('/', validate(createCardSchema), cardsController.createCard);
router.patch('/:id/archive', validate(archiveCardSchema), cardsController.archiveCard);
router.patch('/:id/move', validate(moveCardSchema), cardsController.moveCard);
router.patch('/:id/reorder', validate(reorderCardSchema), cardsController.reorderCard);
router.post('/:id/members', validate(replaceMemberIdsSchema), cardsController.replaceMembers);
router.post('/:id/labels', validate(replaceLabelIdsSchema), cardsController.replaceLabels);
router.patch('/:id', validate(updateCardSchema), cardsController.updateCard);
router.delete('/:id', cardsController.deleteCard);

export default router;
