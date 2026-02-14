const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const auth = require("../middleware/auth");

router.get("/:id", auth, async (req, res) => {
  const user = await pool.query(
    `SELECT id, username, nickname, birthdate, phone, avatar_url
     FROM users WHERE id=$1`,
    [req.params.id]
  );

  res.json(user.rows[0]);
});

module.exports = router;