import pool from '../db/pool.js';
import { mapChecklistItem } from '../utils/mapRow.js';

export async function createChecklistItem(cardId, { text }) {
  const [result] = await pool.query(
    'INSERT INTO checklist_items (card_id, text) VALUES (?, ?)',
    [cardId, text]
  );
  const [rows] = await pool.query(
    'SELECT id, card_id, text, completed, created_at FROM checklist_items WHERE id = ?',
    [result.insertId]
  );
  return mapChecklistItem(rows[0]);
}

export async function updateChecklistItem(itemId, { completed }) {
  await pool.query('UPDATE checklist_items SET completed = ? WHERE id = ?', [completed, itemId]);
  const [rows] = await pool.query(
    'SELECT id, card_id, text, completed, created_at FROM checklist_items WHERE id = ?',
    [itemId]
  );
  if (!rows.length) return null;
  return mapChecklistItem(rows[0]);
}

export async function deleteChecklistItem(itemId) {
  const [result] = await pool.query('DELETE FROM checklist_items WHERE id = ?', [itemId]);
  return result.affectedRows > 0;
}
