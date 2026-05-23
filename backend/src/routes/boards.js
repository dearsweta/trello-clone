import { Router } from 'express';
import * as boardsController from '../controllers/boardsController.js';
import { validate } from '../middleware/validate.js';
import { createBoardSchema, updateBoardSchema } from '../validators/boards.js';

const router = Router();

router.get('/', boardsController.listBoards);
router.get('/:boardId', boardsController.getBoard);
router.post('/', validate(createBoardSchema), boardsController.createBoard);
router.patch('/:boardId', validate(updateBoardSchema), boardsController.updateBoard);

export default router;
