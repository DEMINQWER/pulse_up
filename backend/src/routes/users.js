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
   AUTH MIDDLEWARE
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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

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
    console.error("GET /me ERROR:", error);
    res.status(401).json({ error: error.message });
  }
});

/* =========================
   UPDATE PROFILE
========================= */

router.put("/update", async (req, res) => {
  try {
    const decoded = auth(req);

    const { username, email, nickname, birthdate, phone } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET username=$1, email=$2, nickname=$3, birthdate=$4, phone=$5
       WHERE id=$6
       RETURNING id, username, email, nickname, birthdate, phone, role, avatar_url`,
      [username, email, nickname, birthdate, phone, decoded.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
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
    console.error("UPLOAD AVATAR ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   TEMP FIX USERNAME
========================= */

router.get("/fix-username", async (req, res) => {
  try {
    await pool.query(
      "UPDATE users SET username = 'admin18' WHERE id = 18"
    );

    res.json({ message: "Username fixed" });
  } catch (error) {
    console.error("FIX USERNAME ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;