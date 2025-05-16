const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// Отримати викладачів (за факультетом, якщо вказано)
router.get('/', async (req, res) => {
  const { department_id } = req.query;
  try {
    const query = department_id
      ? 'SELECT * FROM teacher WHERE department_id = $1'
      : 'SELECT * FROM teacher';
    const params = department_id ? [department_id] : [];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;