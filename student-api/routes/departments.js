const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// Отримати всі факультети
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Отримати факультети за викладачем
router.get('/by-teacher', async (req, res) => {
  const { teacher_id } = req.query;
  try {
    const result = await pool.query(
      'SELECT DISTINCT d.* FROM department d JOIN teacher t ON d.department_id = t.department_id WHERE t.teacher_id = $1',
      [teacher_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;