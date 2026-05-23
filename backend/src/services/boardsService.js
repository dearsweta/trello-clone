import pool from '../db/pool.js';
import { getNextPosition } from '../utils/position.js';
import { mapBoard, mapList, mapCard, mapChecklistItem } from '../utils/mapRow.js';

export async function getAllBoards() {
  const [rows] = await pool.query(
    'SELECT id, title, background, created_at FROM boards ORDER BY created_at ASC'
  );
  return rows.map(mapBoard);
}

export async function getBoardById(boardId) {
  const [boardRows] = await pool.query(
    'SELECT id, title, background, created_at FROM boards WHERE id = ?',
    [boardId]
  );
  if (!boardRows.length) return null;

  const board = mapBoard(boardRows[0]);

  const [listRows] = await pool.query(
    `SELECT id, board_id, title, type, position, created_at
     FROM lists WHERE board_id = ? ORDER BY position ASC`,
    [boardId]
  );

  const listIds = listRows.map((l) => l.id);
  let cardRows = [];
  if (listIds.length) {
    const placeholders = listIds.map(() => '?').join(',');
    const [cards] = await pool.query(
      `SELECT id, list_id, title, description, position, due_date, archived, cover_image_url, created_at
       FROM cards WHERE list_id IN (${placeholders}) AND archived = FALSE
       ORDER BY position ASC`,
      listIds
    );
    cardRows = cards;
  }

  const cardIds = cardRows.map((c) => c.id);
  let memberLinks = [];
  let labelLinks = [];
  let checklistRows = [];

  if (cardIds.length) {
    const placeholders = cardIds.map(() => '?').join(',');
    const [members] = await pool.query(
      `SELECT card_id, member_id FROM card_members WHERE card_id IN (${placeholders})`,
      cardIds
    );
    memberLinks = members;
    const [labels] = await pool.query(
      `SELECT card_id, label_id FROM card_labels WHERE card_id IN (${placeholders})`,
      cardIds
    );
    labelLinks = labels;
    const [checklist] = await pool.query(
      `SELECT id, card_id, text, completed, created_at
       FROM checklist_items WHERE card_id IN (${placeholders}) ORDER BY created_at ASC`,
      cardIds
    );
    checklistRows = checklist;
  }

  const [allMembers] = await pool.query('SELECT id, name, avatar_color FROM members ORDER BY id ASC');
  const [allLabels] = await pool.query('SELECT id, name, color FROM labels ORDER BY id ASC');

  const membersByCard = {};
  memberLinks.forEach(({ card_id, member_id }) => {
    if (!membersByCard[card_id]) membersByCard[card_id] = [];
    membersByCard[card_id].push(member_id);
  });

  const labelsByCard = {};
  labelLinks.forEach(({ card_id, label_id }) => {
    if (!labelsByCard[card_id]) labelsByCard[card_id] = [];
    labelsByCard[card_id].push(label_id);
  });

  const checklistByCard = {};
  checklistRows.forEach((row) => {
    const item = mapChecklistItem(row);
    if (!checklistByCard[item.cardId]) checklistByCard[item.cardId] = [];
    checklistByCard[item.cardId].push(item);
  });

  const cardsByList = {};
  cardRows.forEach((row) => {
    const card = mapCard(row);
    card.memberIds = membersByCard[card.id] || [];
    card.labelIds = labelsByCard[card.id] || [];
    card.checklistItems = checklistByCard[card.id] || [];
    if (!cardsByList[card.listId]) cardsByList[card.listId] = [];
    cardsByList[card.listId].push(card);
  });

  board.lists = listRows.map((row) => {
    const list = mapList(row);
    list.cards = cardsByList[list.id] || [];
    return list;
  });

  board.members = allMembers.map((r) => ({
    id: r.id,
    name: r.name,
    avatarColor: r.avatar_color,
  }));

  board.labels = allLabels.map((r) => ({
    id: r.id,
    name: r.name,
    color: r.color,
  }));

  return board;
}

export async function createBoard({ title }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO boards (title, background) VALUES (?, ?)',
      [title, '#7C3AED']
    );
    const boardId = result.insertId;
    await conn.query(
      'INSERT INTO lists (board_id, title, type, position) VALUES (?, ?, ?, ?)',
      [boardId, 'Inbox', 'inbox', 500]
    );
    await conn.commit();
    return getBoardById(boardId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function updateBoard(boardId, data) {
  const fields = [];
  const values = [];
  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.background !== undefined) {
    fields.push('background = ?');
    values.push(data.background);
  }
  if (!fields.length) return getBoardById(boardId);
  values.push(boardId);
  await pool.query(`UPDATE boards SET ${fields.join(', ')} WHERE id = ?`, values);
  return getBoardById(boardId);
}

export async function getMaxListPosition(boardId) {
  const [rows] = await pool.query(
    'SELECT MAX(position) as maxPos FROM lists WHERE board_id = ? AND type = ?',
    [boardId, 'board']
  );
  return rows[0]?.maxPos ?? 0;
}
