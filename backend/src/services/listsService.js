import pool from '../db/pool.js';
import { getNextPosition } from '../utils/position.js';
import * as boardsService from './boardsService.js';

export async function createList({ boardId, title }) {
  const maxPos = await boardsService.getMaxListPosition(boardId);
  const position = getNextPosition(maxPos);
  const [result] = await pool.query(
    'INSERT INTO lists (board_id, title, type, position) VALUES (?, ?, ?, ?)',
    [boardId, title, 'board', position]
  );
  return { id: result.insertId, boardId, title, type: 'board', position };
}

export async function updateList(listId, { title }) {
  const [rows] = await pool.query('SELECT id FROM lists WHERE id = ?', [listId]);
  if (!rows.length) return null;
  await pool.query('UPDATE lists SET title = ? WHERE id = ?', [title, listId]);
  return { id: listId, title };
}

export async function deleteList(listId) {
  const [rows] = await pool.query('SELECT board_id FROM lists WHERE id = ?', [listId]);
  if (!rows.length) return false;
  await pool.query('DELETE FROM lists WHERE id = ?', [listId]);
  return rows[0].board_id;
}

export async function reorderList({ listId, newPosition }) {
  const [rows] = await pool.query('SELECT id FROM lists WHERE id = ?', [listId]);
  if (!rows.length) return false;
  await pool.query('UPDATE lists SET position = ? WHERE id = ?', [newPosition, listId]);
  return true;
}
