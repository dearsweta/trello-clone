import * as listsService from '../services/listsService.js';
import * as boardsService from '../services/boardsService.js';

export async function createList(req, res, next) {
  try {
    const list = await listsService.createList(req.body);
    const board = await boardsService.getBoardById(req.body.boardId);
    res.status(201).json({ list, board });
  } catch (err) {
    next(err);
  }
}

export async function updateList(req, res, next) {
  try {
    const list = await listsService.updateList(Number(req.params.id), req.body);
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

export async function deleteList(req, res, next) {
  try {
    const boardId = await listsService.deleteList(Number(req.params.id));
    if (!boardId) return res.status(404).json({ error: 'List not found' });
    const board = await boardsService.getBoardById(boardId);
    res.json(board);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

export async function reorderList(req, res, next) {
  try {
    const ok = await listsService.reorderList(req.body);
    if (!ok) return res.status(404).json({ error: 'List not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
