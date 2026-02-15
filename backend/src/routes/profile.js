const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');


// ======================
// GET PROFILE
// ======================
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, nickname, birthdate, phone, role, avatar_url, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});


// ======================
// UPDATE PROFILE
// ======================
router.put('/', auth, async (req, res) => {
  try {
    const { nickname, username, birth_date, phone } = req.body;

    await pool.query(
      `UPDATE users
       SET nickname = $1,
           username = $2,
           birth_date = $3,
           phone = $4
       WHERE id = $5`,
      [nickname, username, birth_date || null, phone, req.user.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});


// ======================
// DELETE ACCOUNT
// ======================
router.delete('/', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;