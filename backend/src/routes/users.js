const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const multer = require("multer");
const path = require("path");

/* =========================
   MULTER CONFIG
========================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =========================
   AUTH FUNCTION
========================= */

function auth(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

/* =========================
   GET CURRENT USER
========================= */

router.get("/me", async (req, res) => {
  try {
    const decoded = auth(req);

    const result = await pool.query(
      `SELECT id, username, email, nickname, birthdate, phone, role, avatar_url
       FROM users WHERE id = $1`,
      [decoded.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (user.avatar_url && !user.avatar_url.startsWith("http")) {
      const BASE_URL =
        process.env.BASE_URL ||
        "https://pulse-9ui4.onrender.com";

      user.avatar_url = `${BASE_URL}${user.avatar_url}`;
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

/* =========================
   UPDATE PROFILE
   (email НЕ меняется)
========================= */

router.put("/me", async (req, res) => {
  try {
    const decoded = auth(req);
    const { username, nickname, birthdate, phone } = req.body;

    // Проверка уникальности username
    const check = await pool.query(
      "SELECT id FROM users WHERE username = $1 AND id != $2",
      [username, decoded.id]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const result = await pool.query(
      `UPDATE users
       SET username=$1,
           nickname=$2,
           birthdate=$3,
           phone=$4
       WHERE id=$5
       RETURNING id, username, email, nickname, birthdate, phone, role, avatar_url`,
      [username, nickname, birthdate, phone, decoded.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE ACCOUNT
========================= */

router.delete("/me", async (req, res) => {
  try {
    const decoded = auth(req);

    await pool.query("DELETE FROM users WHERE id = $1", [decoded.id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   SEARCH USERS
========================= */

router.get("/search", async (req, res) => {
  try {
    const decoded = auth(req);
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Username query required" });
    }

    const result = await pool.query(
      `SELECT id, username, nickname, avatar_url
       FROM users
       WHERE username ILIKE $1
       AND id != $2
       LIMIT 20`,
      [`%${username}%`, decoded.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPLOAD AVATAR
========================= */

router.post("/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const decoded = auth(req);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const avatarPath = `/uploads/${req.file.filename}`;

    await pool.query(
      "UPDATE users SET avatar_url=$1 WHERE id=$2",
      [avatarPath, decoded.id]
    );

    const BASE_URL =
      process.env.BASE_URL ||
      "https://pulse-9ui4.onrender.com";

    res.json({
      avatar_url: `${BASE_URL}${avatarPath}`,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;