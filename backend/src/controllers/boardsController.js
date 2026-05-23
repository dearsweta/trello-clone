import * as boardsService from '../services/boardsService.js';

export async function listBoards(req, res, next) {
  try {
    const boards = await boardsService.getAllBoards();
    res.json(boards);
  } catch (err) {
    next(err);
  }
}

export async function getBoard(req, res, next) {
  try {
    const board = await boardsService.getBoardById(Number(req.params.boardId));
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json(board);
  } catch (err) {
    next(err);
  }
}

export async function createBoard(req, res, next) {
  try {
    const board = await boardsService.createBoard(req.body);
    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
}

export async function updateBoard(req, res, next) {
  try {
    const board = await boardsService.updateBoard(Number(req.params.boardId), req.body);
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json(board);
  } catch (err) {
    next(err);
  }
}
