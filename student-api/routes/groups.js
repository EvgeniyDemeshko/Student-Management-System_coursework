const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// Отримати групи (за спеціальністю, якщо вказано)
router.get('/', async (req, res) => {
  const { specialty_id } = req.query;
  try {
    const query = specialty_id
      ? 'SELECT * FROM students_group WHERE specialty_id = $1'
      : 'SELECT * FROM students_group';
    const params = specialty_id ? [specialty_id] : [];
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;