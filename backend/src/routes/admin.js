const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.use(auth);
router.use(role(["admin", "moderator"]));

/* =========================
   ПОЛУЧИТЬ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
========================= */

router.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, is_banned FROM users ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err);
    res.status(500).json({ error: "Ошибка получения пользователей" });
  }
});

/* =========================
   БАН
========================= */

router.put("/ban/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ error: "Нельзя забанить самого себя" });
    }

    if (req.user.role === "moderator") {
  const target = await pool.query(
    "SELECT role FROM users WHERE id = $1",
    [userId]
  );

  if (target.rows[0]?.role === "admin") {
    return res.status(403).json({
      error: "Модератор не может банить администратора",
    });
  }
}

    await pool.query(
      "UPDATE users SET is_banned = true WHERE id = $1",
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("BAN ERROR:", err);
    res.status(500).json({ error: "Ошибка бана" });
  }
});

/* =========================
   РАЗБАН
========================= */

router.put("/unban/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await pool.query(
      "UPDATE users SET is_banned = false WHERE id = $1",
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UNBAN ERROR:", err);
    res.status(500).json({ error: "Ошибка разбана" });
  }
});

/* =========================
   СДЕЛАТЬ МОДЕРАТОРОМ
========================= */

router.put("/make-moderator/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await pool.query(
      "UPDATE users SET role = 'moderator' WHERE id = $1",
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("MAKE MOD ERROR:", err);
    res.status(500).json({ error: "Ошибка назначения модератора" });
  }
});

/* =========================
   СДЕЛАТЬ АДМИНОМ
========================= */

router.put("/make-admin/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await pool.query(
      "UPDATE users SET role = 'admin' WHERE id = $1",
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("MAKE ADMIN ERROR:", err);
    res.status(500).json({ error: "Ошибка назначения администратора" });
  }
});

/* =========================
   УБРАТЬ РОЛЬ (СДЕЛАТЬ USER)
========================= */

router.put("/make-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await pool.query(
      "UPDATE users SET role = 'user' WHERE id = $1",
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("MAKE USER ERROR:", err);
    res.status(500).json({ error: "Ошибка изменения роли" });
  }
});

/* =========================
   СТАТИСТИКА
========================= */

router.get("/stats", async (req, res) => {
  try {
    const total = await pool.query(
      "SELECT COUNT(*) FROM users"
    );

    const banned = await pool.query(
      "SELECT COUNT(*) FROM users WHERE is_banned = true"
    );

    const admins = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'admin'"
    );

    const moderators = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'moderator'"
    );

    res.json({
      total: total.rows[0].count,
      banned: banned.rows[0].count,
      admins: admins.rows[0].count,
      moderators: moderators.rows[0].count,
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ error: "Ошибка статистики" });
  }
});

module.exports = router;