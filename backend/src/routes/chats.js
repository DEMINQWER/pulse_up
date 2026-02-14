const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");

// Автостарт чата
router.post("/start", auth, async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ error: "User required" });

  // Проверяем существующий чат
  const existing = await pool.query(`
    SELECT c.id FROM chats c
    JOIN chat_users cu1 ON cu1.chat_id = c.id
    JOIN chat_users cu2 ON cu2.chat_id = c.id
    WHERE cu1.user_id = $1
      AND cu2.user_id = $2
      AND c.is_group = false
  `, [req.user.id, userId]);

  if (existing.rows.length)
    return res.json({ chatId: existing.rows[0].id });

  const chat = await pool.query(
    `INSERT INTO chats (is_group) VALUES (false) RETURNING id`
  );

  await pool.query(
    `INSERT INTO chat_users (chat_id,user_id)
     VALUES ($1,$2),($1,$3)`,
    [chat.rows[0].id, req.user.id, userId]
  );

  res.json({ chatId: chat.rows[0].id });
});

module.exports = router;