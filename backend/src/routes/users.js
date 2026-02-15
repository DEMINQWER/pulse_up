const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../db'); // ВАЖНО: ../db

/* =========================
   GET CURRENT USER
========================= */

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, username, role, avatar_url FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Формируем полный URL аватара
    if (user.avatar_url) {
      const BASE_URL =
        process.env.BASE_URL ||
        "https://pulse-9ui4.onrender.com";

      if (!user.avatar_url.startsWith("http")) {
        user.avatar_url = `${BASE_URL}${user.avatar_url}`;
      }
    }

    res.json(user);

  } catch (error) {
  console.error("JWT ERROR:", error);
  res.status(401).json({ error: error.message });
}
});

module.exports = router;