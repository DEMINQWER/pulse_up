const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');

/* =========================
   GET MESSAGES
========================= */

router.get('/:chatId', auth, async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);

    if (!chatId) {
      return res.status(400).json({ error: "Invalid chat id" });
    }

    // Проверяем существование чата
    const chatExists = await pool.query(
      `SELECT id FROM chats WHERE id = $1`,
      [chatId]
    );

    if (chatExists.rows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Проверяем что пользователь участник
    const accessCheck = await pool.query(
      `SELECT 1 FROM chat_users WHERE chat_id = $1 AND user_id = $2`,
      [chatId, req.user.id]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: "Нет доступа к чату" });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE chat_id = $1
      ORDER BY created_at ASC
      LIMIT 50
      `,
      [chatId]
    );

    res.json(result.rows);

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
    const chatId = parseInt(req.params.chatId);
    const { content } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: "Invalid chat id" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content required" });
    }

    // Проверяем существование чата
    const chatExists = await pool.query(
      `SELECT id FROM chats WHERE id = $1`,
      [chatId]
    );

    if (chatExists.rows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Проверяем участие пользователя
    const accessCheck = await pool.query(
      `SELECT 1 FROM chat_users WHERE chat_id = $1 AND user_id = $2`,
      [chatId, req.user.id]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: "Нет доступа к чату" });
    }

    const result = await pool.query(
      `
      INSERT INTO messages (chat_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [chatId, req.user.id, content.trim()]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ error: "Send message failed" });
  }
});

module.exports = router;