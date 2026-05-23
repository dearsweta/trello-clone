import pool from '../db/pool.js';
import { mapInboxCard } from '../utils/mapRow.js';
import * as boardsService from './boardsService.js';
import * as cardsService from './cardsService.js';
export async function getInboxCards() {
  const [rows] = await pool.query(
    `SELECT ic.id, ic.title, ic.description, ic.created_by, ic.archived, ic.created_at,
            m.id as member_id, m.name as member_name, m.avatar_color
     FROM inbox_cards ic
     LEFT JOIN members m ON ic.created_by = m.id
     WHERE ic.archived = FALSE
     ORDER BY ic.created_at ASC`
  );

  return rows.map((row) =>
    mapInboxCard(row, row.member_id ? { id: row.member_id, name: row.member_name, avatar_color: row.avatar_color } : null)
  );
}

export async function createInboxCard({ title, description, createdBy, fromCardId }) {
  if (fromCardId) {
    return transferBoardCardToInbox(fromCardId);
  }

  const [result] = await pool.query(
    'INSERT INTO inbox_cards (title, description, created_by) VALUES (?, ?, ?)',
    [title, description ?? null, createdBy ?? null]
  );

  const cards = await getInboxCards();
  const created = cards.find((c) => c.id === result.insertId);
  return { card: created, cards };
}

export async function updateInboxCard(inboxId, { title, description }) {
  const fields = [];
  const values = [];
  if (title !== undefined) {
    fields.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description);
  }
  if (!fields.length) return getInboxCards().then((cards) => cards.find((c) => c.id === inboxId) ?? null);
  values.push(inboxId);
  await pool.query(`UPDATE inbox_cards SET ${fields.join(', ')} WHERE id = ?`, values);
  const cards = await getInboxCards();
  return cards.find((c) => c.id === inboxId) ?? null;
}

export async function deleteInboxCard(inboxId) {
  const [result] = await pool.query('DELETE FROM inbox_cards WHERE id = ?', [inboxId]);
  if (!result.affectedRows) return null;
  const cards = await getInboxCards();
  return { cards };
}

export async function transferBoardCardToInbox(cardId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [cardRows] = await conn.query(
      `SELECT c.id, c.title, c.description, l.board_id
       FROM cards c JOIN lists l ON c.list_id = l.id WHERE c.id = ?`,
      [cardId]
    );
    if (!cardRows.length) {
      const err = new Error('Card not found');
      err.status = 404;
      throw err;
    }

    const card = cardRows[0];
    const boardId = card.board_id;

    const [memberRows] = await conn.query(
      'SELECT member_id FROM card_members WHERE card_id = ? LIMIT 1',
      [cardId]
    );
    const createdBy = memberRows[0]?.member_id ?? null;

    const [inboxResult] = await conn.query(
      'INSERT INTO inbox_cards (title, description, created_by) VALUES (?, ?, ?)',
      [card.title, card.description, createdBy]
    );

    await conn.query('DELETE FROM cards WHERE id = ?', [cardId]);
    await conn.commit();

    const cards = await getInboxCards();
    const board = await boardsService.getBoardById(boardId);
    const inboxCard = cards.find((c) => c.id === inboxResult.insertId);

    return { inboxCard, cards, board };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function transferInboxCardToBoard(inboxId, listId, newPosition) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [inboxRows] = await conn.query(
      'SELECT id, title, description FROM inbox_cards WHERE id = ? AND archived = FALSE',
      [inboxId]
    );
    if (!inboxRows.length) {
      const err = new Error('Inbox card not found');
      err.status = 404;
      throw err;
    }

    const inbox = inboxRows[0];

    const [listRows] = await conn.query('SELECT board_id FROM lists WHERE id = ?', [listId]);
    if (!listRows.length) {
      const err = new Error('List not found');
      err.status = 404;
      throw err;
    }
    const boardId = listRows[0].board_id;

    const [cardResult] = await conn.query(
      'INSERT INTO cards (list_id, title, description, position) VALUES (?, ?, ?, ?)',
      [listId, inbox.title, inbox.description, newPosition]
    );

    await conn.query('DELETE FROM inbox_cards WHERE id = ?', [inboxId]);
    await conn.commit();

    const cards = await getInboxCards();
    const board = await boardsService.getBoardById(boardId);
    const card = await cardsService.getCard(cardResult.insertId);

    return { card, cards, board };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
