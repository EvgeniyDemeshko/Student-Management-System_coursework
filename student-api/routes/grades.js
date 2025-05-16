const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.get('/student/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT g.grade_id, g.student_id, g.subject_id, g.grade,
             s.subject_name, s.credits,
             t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM grade g
      JOIN subject s ON g.subject_id = s.subject_id
      JOIN teacher t ON s.teacher_id = t.teacher_id
      WHERE g.student_id = $1
      `,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/check', async (req, res) => {
  try {
    const { student_id, subject_id } = req.query;
    const result = await pool.query(
      'SELECT grade_id, grade FROM grade WHERE student_id = $1 AND subject_id = $2',
      [student_id, subject_id]
    );
    if (result.rows.length > 0) {
      res.json({ exists: true, grade: result.rows[0] });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { student_id, subject_id, grade } = req.body;
    const existingGrade = await pool.query(
      'SELECT grade_id FROM grade WHERE student_id = $1 AND subject_id = $2',
      [student_id, subject_id]
    );
    if (existingGrade.rows.length > 0) {
      return res.status(409).json({ error: 'Оцінка для цього предмета вже існує' });
    }
    const result = await pool.query(
      'INSERT INTO grade (student_id, subject_id, grade) VALUES ($1, $2, $3) RETURNING *',
      [student_id, subject_id, grade]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { grade } = req.body;
    const result = await pool.query(
      'UPDATE grade SET grade = $1 WHERE grade_id = $2 RETURNING *',
      [grade, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Оцінку не знайдено' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM grade WHERE grade_id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Оцінку не знайдено' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;