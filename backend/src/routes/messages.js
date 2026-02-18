const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');
const admin = require('../firebaseAdmin');

/* =========================
   GET MESSAGES
========================= */

router.get('/:chatId', auth, async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);

    if (!chatId) {
      return res.status(400).json({ error: "Invalid chat id" });
    }

    const chatExists = await pool.query(
      `SELECT id FROM chats WHERE id = $1`,
      [chatId]
    );

    if (chatExists.rows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

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
   SEND MESSAGE + PUSH
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

    const chatExists = await pool.query(
      `SELECT id FROM chats WHERE id = $1`,
      [chatId]
    );

    if (chatExists.rows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const accessCheck = await pool.query(
      `SELECT 1 FROM chat_users WHERE chat_id = $1 AND user_id = $2`,
      [chatId, req.user.id]
    );

    if (accessCheck.rows.length === 0) {
      return res.status(403).json({ error: "Нет доступа к чату" });
    }

    // 1️⃣ Сохраняем сообщение
    const result = await pool.query(
      `
      INSERT INTO messages (chat_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [chatId, req.user.id, content.trim()]
    );

    const message = result.rows[0];

    // 2️⃣ Получаем получателей
    const usersResult = await pool.query(
      `SELECT u.device_token
       FROM chat_users cu
       JOIN users u ON cu.user_id = u.id
       WHERE cu.chat_id = $1
       AND u.id != $2`,
      [chatId, req.user.id]
    );

    const recipients = usersResult.rows;

    // 3️⃣ Отправляем push
    for (const user of recipients) {
      if (user.device_token) {
        await admin.messaging().send({
          token: user.device_token,
          notification: {
            title: "📩 Новое сообщение",
            body: content,
          },
          data: {
            chatId: chatId.toString(),
          },
        });
      }
    }

    res.json(message);

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ error: "Send message failed" });
  }
});

module.exports = router;