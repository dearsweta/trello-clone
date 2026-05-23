import pool from '../db/pool.js';
import { mapLabel } from '../utils/mapRow.js';

export async function getAllLabels() {
  const [rows] = await pool.query('SELECT id, name, color FROM labels ORDER BY id ASC');
  return rows.map(mapLabel);
}

export async function replaceCardLabels(cardId, labelIds) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM card_labels WHERE card_id = ?', [cardId]);
    if (labelIds.length) {
      const values = labelIds.map((lid) => [cardId, lid]);
      await conn.query('INSERT INTO card_labels (card_id, label_id) VALUES ?', [values]);
    }
    await conn.commit();
    return labelIds;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
