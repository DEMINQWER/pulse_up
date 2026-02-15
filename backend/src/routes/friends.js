const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");

/* =========================
   LIST FRIENDS
========================= */

router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT u.id, u.username, u.nickname, u.avatar_url
      FROM friends f
      JOIN users u
        ON (u.id = f.addressee_id OR u.id = f.requester_id)
      WHERE (f.requester_id = $1 OR f.addressee_id = $1)
        AND u.id != $1
        AND f.status = 'accepted'
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET FRIENDS ERROR:", err);
    res.status(500).json({ error: "Failed to load friends" });
  }
});

/* =========================
   SEND FRIEND REQUEST
========================= */

router.post("/request/:id", auth, async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);

    if (targetId === req.user.id) {
      return res.status(400).json({ error: "Cannot add yourself" });
    }

    await pool.query(
      `
      INSERT INTO friends (requester_id, addressee_id, status)
      VALUES ($1, $2, 'pending')
      ON CONFLICT DO NOTHING
      `,
      [req.user.id, targetId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("FRIEND REQUEST ERROR:", err);
    res.status(500).json({ error: "Request failed" });
  }
});

module.exports = router;