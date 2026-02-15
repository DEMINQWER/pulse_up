const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");
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
   GET CURRENT USER
========================= */

router.get("/me", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, nickname, birthdate, phone, role, avatar_url
       FROM users WHERE id = $1`,
      [req.user.id]
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

  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

/* =========================
   UPDATE PROFILE
========================= */

router.put("/me", auth, async (req, res) => {
  try {
    const { username, nickname, birthdate, phone } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ error: "Username too short" });
    }

    // Проверка уникальности username
    const check = await pool.query(
      "SELECT id FROM users WHERE username = $1 AND id != $2",
      [username, req.user.id]
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
      [username.trim(), nickname, birthdate, phone, req.user.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

/* =========================
   DELETE ACCOUNT
========================= */

router.delete("/me", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* =========================
   SEARCH USERS
========================= */

router.get("/search", auth, async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.length < 2) {
      return res.json([]);
    }

    const result = await pool.query(
      `
      SELECT id, username, nickname, avatar_url
      FROM users
      WHERE username ILIKE $1
        AND id != $2
      ORDER BY username ASC
      LIMIT 20
      `,
      [`%${username}%`, req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

/* =========================
   UPLOAD AVATAR
========================= */

router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const avatarPath = `/uploads/${req.file.filename}`;

    await pool.query(
      "UPDATE users SET avatar_url=$1 WHERE id=$2",
      [avatarPath, req.user.id]
    );

    const BASE_URL =
      process.env.BASE_URL ||
      "https://pulse-9ui4.onrender.com";

    res.json({
      avatar_url: `${BASE_URL}${avatarPath}`,
    });

  } catch (err) {
    console.error("UPLOAD AVATAR ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;