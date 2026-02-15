const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

/* =========================
   GET USER CHATS
========================= */

router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `
      SELECT c.*
      FROM chats c
      JOIN chat_users cu ON c.id = cu.chat_id
      WHERE cu.user_id = $1
      `,
      [decoded.id]
    );

    res.json({ chats: result.rows });

  } catch (error) {
    console.error("GET /chats ERROR:", error);
    res.status(500).json({ error: "Failed to get chats" });
  }
});

router.post("/private/:userId", async (req, res) => {
  try {
    const decoded = auth(req);
    const otherUserId = parseInt(req.params.userId);

    if (decoded.id === otherUserId) {
      return res.status(400).json({ error: "Нельзя создать чат с собой" });
    }

    // Проверяем существующий чат
    const existing = await pool.query(`
      SELECT c.id FROM chats c
      JOIN chat_users cu1 ON cu1.chat_id = c.id
      JOIN chat_users cu2 ON cu2.chat_id = c.id
      WHERE c.is_group = false
      AND cu1.user_id = $1
      AND cu2.user_id = $2
    `, [decoded.id, otherUserId]);

    if (existing.rows.length > 0) {
      return res.json({ chatId: existing.rows[0].id });
    }

    // Создаём новый чат
    const chat = await pool.query(
      "INSERT INTO chats (is_group) VALUES (false) RETURNING id"
    );

    const chatId = chat.rows[0].id;

    await pool.query(
      "INSERT INTO chat_users (chat_id, user_id) VALUES ($1,$2), ($1,$3)",
      [chatId, decoded.id, otherUserId]
    );

    res.json({ chatId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;