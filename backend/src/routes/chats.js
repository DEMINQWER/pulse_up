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

module.exports = router;