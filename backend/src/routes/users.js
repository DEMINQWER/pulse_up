const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { db } = require('../db');

/* =========================
   GET CURRENT USER
========================= */

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.get(
      "SELECT id, username, role, avatar FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("GET /users/me ERROR:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;