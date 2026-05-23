import * as cardsService from '../services/cardsService.js';
import * as boardsService from '../services/boardsService.js';
import * as membersService from '../services/membersService.js';
import * as labelsService from '../services/labelsService.js';
import pool from '../db/pool.js';

async function getBoardIdForCard(cardId) {
  const [rows] = await pool.query(
    `SELECT l.board_id FROM cards c JOIN lists l ON c.list_id = l.id WHERE c.id = ?`,
    [cardId]
  );
  return rows[0]?.board_id;
}

async function getBoardIdForList(listId) {
  const [rows] = await pool.query('SELECT board_id FROM lists WHERE id = ?', [listId]);
  return rows[0]?.board_id;
}

export async function createCard(req, res, next) {
  try {
    const card = await cardsService.createCard(req.body);
    const boardId = await getBoardIdForList(req.body.listId);
    const board = boardId ? await boardsService.getBoardById(boardId) : null;
    res.status(201).json({ card, board });
  } catch (err) {
    next(err);
  }
}

export async function updateCard(req, res, next) {
  try {
    const card = await cardsService.updateCard(Number(req.params.id), req.body);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (err) {
    next(err);
  }
}

export async function deleteCard(req, res, next) {
  try {
    const boardId = await getBoardIdForCard(Number(req.params.id));
    const ok = await cardsService.deleteCard(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: 'Card not found' });
    const board = boardId ? await boardsService.getBoardById(boardId) : null;
    res.json(board);
  } catch (err) {
    next(err);
  }
}

export async function archiveCard(req, res, next) {
  try {
    const result = await cardsService.archiveCard(Number(req.params.id), req.body.archived);
    const boardId = await getBoardIdForCard(Number(req.params.id));
    const board = boardId ? await boardsService.getBoardById(boardId) : null;
    res.json({ ...result, board });
  } catch (err) {
    next(err);
  }
}

export async function moveCard(req, res, next) {
  try {
    const card = await cardsService.moveCard(Number(req.params.id), req.body);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (err) {
    next(err);
  }
}

export async function reorderCard(req, res, next) {
  try {
    const card = await cardsService.reorderCard(Number(req.params.id), req.body);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (err) {
    next(err);
  }
}

export async function replaceMembers(req, res, next) {
  try {
    const memberIds = await membersService.replaceCardMembers(
      Number(req.params.id),
      req.body.memberIds || []
    );
    const card = await cardsService.getCard(Number(req.params.id));
    res.json({ memberIds, card });
  } catch (err) {
    next(err);
  }
}

export async function replaceLabels(req, res, next) {
  try {
    const labelIds = await labelsService.replaceCardLabels(
      Number(req.params.id),
      req.body.labelIds || []
    );
    const card = await cardsService.getCard(Number(req.params.id));
    res.json({ labelIds, card });
  } catch (err) {
    next(err);
  }
}
