import pool from '../db/pool.js';
import { mapMember } from '../utils/mapRow.js';

export async function getAllMembers() {
  const [rows] = await pool.query('SELECT id, name, avatar_color FROM members ORDER BY id ASC');
  return rows.map(mapMember);
}

export async function replaceCardMembers(cardId, memberIds) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM card_members WHERE card_id = ?', [cardId]);
    if (memberIds.length) {
      const values = memberIds.map((mid) => [cardId, mid]);
      await conn.query('INSERT INTO card_members (card_id, member_id) VALUES ?', [values]);
    }
    await conn.commit();
    return memberIds;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
