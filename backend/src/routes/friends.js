const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");

// Добавить по username
router.post("/add", auth, async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: "Username required" });

  const user = await pool.query(
    "SELECT id FROM users WHERE username=$1",
    [username]
  );

  if (!user.rows.length) return res.status(404).json({ error: "User not found" });

  if (user.rows[0].id === req.user.id)
    return res.status(400).json({ error: "Cannot add yourself" });

  try {
    await pool.query(
      `INSERT INTO friends (requester_id, addressee_id, status)
       VALUES ($1,$2,'accepted')`,
      [req.user.id, user.rows[0].id]
    );

    res.json({ success: true });
  } catch {
    res.status(400).json({ error: "Already added" });
  }
});

// список друзей
router.get("/", auth, async (req, res) => {
  const result = await pool.query(`
    SELECT u.id, u.username, u.nickname, u.avatar_url
    FROM friends f
    JOIN users u
      ON (u.id = f.addressee_id OR u.id = f.requester_id)
    WHERE (f.requester_id = ${req.user.id}
       OR f.addressee_id = ${req.user.id})
      AND u.id != ${req.user.id}
  `);

  res.json(result.rows);
});

module.exports = router;