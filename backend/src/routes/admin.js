const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.use(auth);
router.use(role(["admin", "moderator"]));

/* =========================
   ПОЛУЧИТЬ ПОЛЬЗОВАТЕЛЕЙ С ПАГИНАЦИЕЙ
========================= */

router.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = await pool.query(
      `SELECT id, username, email, role, is_banned, created_at
       FROM users
       ORDER BY id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const total = await pool.query(`SELECT COUNT(*) FROM users`);

    res.json({
      users: users.rows,
      total: parseInt(total.rows[0].count),
      page,
      pages: Math.ceil(total.rows[0].count / limit),
    });
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err);
    res.status(500).json({ error: "Ошибка получения пользователей" });
  }
});

/* =========================
   СТАТИСТИКА + РЕГИСТРАЦИИ
========================= */

router.get("/stats", async (req, res) => {
  try {
    const total = await pool.query(`SELECT COUNT(*) FROM users`);
    const banned = await pool.query(`SELECT COUNT(*) FROM users WHERE is_banned = true`);
    const admins = await pool.query(`SELECT COUNT(*) FROM users WHERE role = 'admin'`);
    const moderators = await pool.query(`SELECT COUNT(*) FROM users WHERE role = 'moderator'`);

    const registration = await pool.query(`
      SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date,
             COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date ASC
    `);

    res.json({
      total: parseInt(total.rows[0].count),
      banned: parseInt(banned.rows[0].count),
      admins: parseInt(admins.rows[0].count),
      moderators: parseInt(moderators.rows[0].count),
      registration: registration.rows.map(r => ({
        date: r.date,
        count: parseInt(r.count),
      })),
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ error: "Ошибка статистики" });
  }
});

/* =========================
   БАН С ПРИЧИНОЙ + ЛОГ
========================= */

router.post("/ban/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { reason } = req.body;

    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ error: "Нельзя забанить самого себя" });
    }

    await pool.query(
      "UPDATE users SET is_banned = true WHERE id = $1",
      [userId]
    );

    await pool.query(
      `INSERT INTO admin_logs (admin_id, target_id, action, reason)
       VALUES ($1, $2, $3, $4)`,
      [req.user.id, userId, "ban", reason || null]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("BAN ERROR:", err);
    res.status(500).json({ error: "Ошибка бана" });
  }
});

/* =========================
   РАЗБАН + ЛОГ
========================= */

router.put("/unban/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await pool.query(
      "UPDATE users SET is_banned = false WHERE id = $1",
      [userId]
    );

    await pool.query(
      `INSERT INTO admin_logs (admin_id, target_id, action)
       VALUES ($1, $2, $3)`,
      [req.user.id, userId, "unban"]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UNBAN ERROR:", err);
    res.status(500).json({ error: "Ошибка разбана" });
  }
});

/* =========================
   ЛОГИ
========================= */

router.get("/logs", async (req, res) => {
  try {
    const logs = await pool.query(`
      SELECT 
        al.id,
        u1.username as admin,
        u2.username as target,
        al.action,
        al.reason,
        al.created_at
      FROM admin_logs al
      LEFT JOIN users u1 ON al.admin_id = u1.id
      LEFT JOIN users u2 ON al.target_id = u2.id
      ORDER BY al.created_at DESC
      LIMIT 50
    `);

    res.json(logs.rows);
  } catch (err) {
    console.error("LOGS ERROR:", err);
    res.status(500).json({ error: "Ошибка логов" });
  }
});

module.exports = router;