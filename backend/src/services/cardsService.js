import pool from '../db/pool.js';
import { getNextPosition } from '../utils/position.js';
import { mapCard, mapChecklistItem } from '../utils/mapRow.js';

export async function getMaxCardPosition(listId) {
  const [rows] = await pool.query(
    'SELECT MAX(position) as maxPos FROM cards WHERE list_id = ?',
    [listId]
  );
  return rows[0]?.maxPos ?? 0;
}

export async function createCard({ listId, title }) {
  const maxPos = await getMaxCardPosition(listId);
  const position = getNextPosition(maxPos);
  const [result] = await pool.query(
    'INSERT INTO cards (list_id, title, position) VALUES (?, ?, ?)',
    [listId, title, position]
  );
  return {
    id: result.insertId,
    listId,
    title,
    description: null,
    position,
    dueDate: null,
    archived: false,
    coverImageUrl: null,
    memberIds: [],
    labelIds: [],
    checklistItems: [],
  };
}

export async function updateCard(cardId, data) {
  const [rows] = await pool.query('SELECT id FROM cards WHERE id = ?', [cardId]);
  if (!rows.length) return null;

  const fields = [];
  const values = [];
  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.dueDate !== undefined) {
    fields.push('due_date = ?');
    values.push(data.dueDate);
  }
  if (data.coverImageUrl !== undefined) {
    fields.push('cover_image_url = ?');
    values.push(data.coverImageUrl);
  }
  if (!fields.length) return getCard(cardId);

  values.push(cardId);
  await pool.query(`UPDATE cards SET ${fields.join(', ')} WHERE id = ?`, values);
  return getCard(cardId);
}

export async function getCard(cardId) {
  const [rows] = await pool.query(
    `SELECT id, list_id, title, description, position, due_date, archived, cover_image_url, created_at
     FROM cards WHERE id = ?`,
    [cardId]
  );
  if (!rows.length) return null;
  const card = mapCard(rows[0]);
  const [members] = await pool.query(
    'SELECT member_id FROM card_members WHERE card_id = ?',
    [cardId]
  );
  const [labels] = await pool.query(
    'SELECT label_id FROM card_labels WHERE card_id = ?',
    [cardId]
  );
  const [checklist] = await pool.query(
    'SELECT id, card_id, text, completed, created_at FROM checklist_items WHERE card_id = ? ORDER BY created_at ASC',
    [cardId]
  );
  card.memberIds = members.map((m) => m.member_id);
  card.labelIds = labels.map((l) => l.label_id);
  card.checklistItems = checklist.map(mapChecklistItem);
  return card;
}

export async function deleteCard(cardId) {
  const [result] = await pool.query('DELETE FROM cards WHERE id = ?', [cardId]);
  return result.affectedRows > 0;
}

export async function archiveCard(cardId, archived) {
  await pool.query('UPDATE cards SET archived = ? WHERE id = ?', [archived, cardId]);
  return { id: cardId, archived };
}

export async function moveCard(cardId, { newListId, newPosition }) {
  await pool.query(
    'UPDATE cards SET list_id = ?, position = ? WHERE id = ?',
    [newListId, newPosition, cardId]
  );
  return getCard(cardId);
}

export async function reorderCard(cardId, { newPosition }) {
  await pool.query('UPDATE cards SET position = ? WHERE id = ?', [newPosition, cardId]);
  return getCard(cardId);
}
