const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');

/* =========================
   GET USER CHATS
========================= */

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id,
             c.is_group,
             c.created_at,
             u.id AS other_user_id,
             u.username AS other_username
      FROM chats c
      JOIN chat_users cu1 ON cu1.chat_id = c.id
      JOIN chat_users cu2 ON cu2.chat_id = c.id
      JOIN users u ON u.id = cu2.user_id
      WHERE cu1.user_id = $1
        AND cu2.user_id != $1
      ORDER BY c.created_at DESC
      LIMIT 50
    `, [req.user.id]);

    res.json(result.rows);

  } catch (err) {
    console.error("GET CHATS ERROR:", err);
    res.status(500).json({ error: "Failed to load chats" });
  }
});

/* =========================
   GET CHAT INFO (для header)
========================= */

router.get('/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;

    const accessCheck = await pool.query(
      `SELECT 1 FROM chat_users WHERE chat_id = $1 AND user_id = $2`,
      [chatId, req.user.id]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: "Нет доступа к чату" });
    }

    const result = await pool.query(`
      SELECT u.id AS other_user_id,
             u.username AS other_username
      FROM chat_users cu1
      JOIN chat_users cu2 ON cu1.chat_id = cu2.chat_id
      JOIN users u ON u.id = cu2.user_id
      WHERE cu1.chat_id = $1
        AND cu1.user_id = $2
        AND cu2.user_id != $2
    `, [chatId, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("GET CHAT INFO ERROR:", err);
    res.status(500).json({ error: "Failed to load chat info" });
  }
});

/* =========================
   CREATE PRIVATE CHAT
========================= */

router.post('/private/:userId', auth, async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);

    if (!otherUserId) {
      return res.status(400).json({ error: "User ID required" });
    }

    if (otherUserId === req.user.id) {
      return res.status(400).json({ error: "Нельзя создать чат с собой" });
    }

    const userCheck = await pool.query(
      `SELECT id FROM users WHERE id = $1`,
      [otherUserId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const existing = await pool.query(`
      SELECT c.id
      FROM chats c
      JOIN chat_users cu1 ON cu1.chat_id = c.id
      JOIN chat_users cu2 ON cu2.chat_id = c.id
      WHERE c.is_group = false
        AND cu1.user_id = $1
        AND cu2.user_id = $2
    `, [req.user.id, otherUserId]);

    if (existing.rows.length > 0) {
      return res.json({ chatId: existing.rows[0].id });
    }

    const chatResult = await pool.query(`
      INSERT INTO chats (is_group)
      VALUES (false)
      RETURNING id
    `);

    const chatId = chatResult.rows[0].id;

    await pool.query(`
      INSERT INTO chat_users (chat_id, user_id)
      VALUES ($1, $2), ($1, $3)
    `, [chatId, req.user.id, otherUserId]);

    res.json({ chatId });

  } catch (err) {
    console.error("CREATE PRIVATE CHAT ERROR:", err);
    res.status(500).json({ error: "Create private chat failed" });
  }
});

module.exports = router;