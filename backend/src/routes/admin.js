const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth);
router.use(role('admin'));

router.get('/users', async (req, res) => {
  const result = await pool.query(
    'SELECT id, email, role, is_banned FROM users ORDER BY id DESC'
  );

  res.json(result.rows);
});

router.post('/ban', async (req, res) => {
  await pool.query(
    'UPDATE users SET is_banned = true WHERE id = $1',
    [req.body.userId]
  );

  res.json({ success: true });
});

router.post('/unban', async (req, res) => {
  await pool.query(
    'UPDATE users SET is_banned = false WHERE id = $1',
    [req.body.userId]
  );

  res.json({ success: true });
});

router.post('/make-moderator', async (req, res) => {
  await pool.query(
    'UPDATE users SET role = $1 WHERE id = $2',
    ['moderator', req.body.userId]
  );

  res.json({ success: true });
});

module.exports = router;