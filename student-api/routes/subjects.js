const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { department_id } = req.query;
    if (department_id) {
      const result = await pool.query(
        `
        SELECT s.subject_id, s.subject_name, s.credits,
               t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
        FROM subject s
        JOIN teacher t ON s.teacher_id = t.teacher_id
        WHERE s.department_id = $1
        `,
        [department_id]
      );
      res.json(result.rows);
    } else {
      const result = await pool.query(
        `
        SELECT s.subject_id, s.subject_name, s.credits,
               t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
        FROM subject s
        JOIN teacher t ON s.teacher_id = t.teacher_id
        `
      );
      res.json(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;