const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();

// ===============================
// REGISTER
// ===============================
router.post('/register', async (req, res) => {
  try {
    const email = req.body?.email?.trim();
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Проверка пользователя
    const exists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, username, password, role)
VALUES ($1, $2, $3,
  CASE WHEN (SELECT COUNT(*) FROM users) = 0
  THEN 'admin'
  ELSE 'user'
  END
)`,
      [email, hashedPassword]
    );

    // Если вдруг JWT_SECRET не задан — используем fallback
    const secret = process.env.JWT_SECRET || 'fallback_secret';

    const token = jwt.sign(
      { id: result.rows[0].id },
      secret,
      { expiresIn: '30d' }
    );

    return res.status(200).json({ token });

  } catch (err) {
    console.error('REGISTER ERROR FULL:', err);
    return res.status(500).json({
      error: 'Register failed',
      details: err.message
    });
  }
});

// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
  try {
    const email = req.body?.email?.trim();
    const password = req.body?.password;

    // ===============================
    // VALIDATION
    // ===============================
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // ===============================
    // GET USER
    // ===============================
    const result = await pool.query(
      `SELECT id, email, password, role, is_banned
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (!result.rows.length) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // ===============================
    // CHECK BAN
    // ===============================
    if (user.is_banned) {
      return res.status(403).json({ error: 'You are banned' });
    }

    // ===============================
    // CHECK PASSWORD
    // ===============================
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Wrong password' });
    }

    // ===============================
    // CHECK JWT SECRET
    // ===============================
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // ===============================
    // GENERATE TOKEN
    // ===============================
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // ===============================
    // RESPONSE
    // ===============================
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

const authMiddleware = require("../middleware/auth");

/* =========================
   ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
========================= */

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT id, email, username, nickname, birthdate, phone, role, is_banned
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (!user.rows.length) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ error: "Ошибка получения профиля" });
  }
});

module.exports = router;