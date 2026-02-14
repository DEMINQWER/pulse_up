const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');

// ================= GET USER CHATS =================
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*
      FROM chats c
      JOIN chat_users cu ON cu.chat_id = c.id
      WHERE cu.user_id = $1
      ORDER BY c.created_at DESC
    `, [req.user.id]);

    res.json({ chats: result.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Load chats failed' });
  }
});

// ================= CREATE PRIVATE CHAT BY USERNAME =================
router.post('/private', auth, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const userCheck = await pool.query(
      `SELECT id FROM users WHERE username = $1`,
      [username]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otherUserId = userCheck.rows[0].id;

    // создаём чат
    const chatResult = await pool.query(`
      INSERT INTO chats (title, is_group)
      VALUES ($1, false)
      RETURNING *
    `, [username]);

    const chat = chatResult.rows[0];

    await pool.query(`
      INSERT INTO chat_users (chat_id, user_id)
      VALUES ($1, $2), ($1, $3)
    `, [chat.id, req.user.id, otherUserId]);

    res.json(chat);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Create private chat failed' });
  }
});

module.exports = router;