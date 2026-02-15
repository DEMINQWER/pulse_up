const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');

/* =========================
   GET MESSAGES (LIMITED)
========================= */

router.get('/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;

    // Проверяем, что пользователь участник чата
    const check = await pool.query(`
      SELECT 1 FROM chat_users
      WHERE chat_id = $1 AND user_id = $2
    `, [chatId, req.user.id]);

    if (check.rows.length === 0) {
      return res.status(403).json({ error: "Нет доступа к чату" });
    }

    const result = await pool.query(`
      SELECT id, user_id, content, file_url, created_at
      FROM messages
      WHERE chat_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [chatId]);

    res.json(result.rows.reverse());

  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    res.status(500).json({ error: "Load messages failed" });
  }
});

/* =========================
   SEND MESSAGE
========================= */

router.post('/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Message content required" });
    }

    const result = await pool.query(`
      INSERT INTO messages (chat_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [chatId, req.user.id, content]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ error: "Send message failed" });
  }
});

module.exports = router;