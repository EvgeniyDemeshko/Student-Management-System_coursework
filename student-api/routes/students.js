const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// Додати студента
router.post('/', async (req, res) => {
  const { first_name, last_name, email, phone_number, date_of_birth, group_id } = req.body;
  try {
    // Перевірка існування group_id
    const groupCheck = await pool.query('SELECT * FROM students_group WHERE group_id = $1', [group_id]);
    if (groupCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Group not found' });
    }

    const result = await pool.query(
      'INSERT INTO student (first_name, last_name, email, phone_number, date_of_birth, group_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [first_name, last_name, email, phone_number, date_of_birth, group_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Отримати всіх студентів
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT s.student_id, s.first_name, s.last_name, s.email, s.phone_number, s.date_of_birth,
             sg.group_name, sp.specialty_name, d.department_name, sg.year_of_creating
      FROM student s
      JOIN students_group sg ON s.group_id = sg.group_id
      JOIN specialty sp ON sg.specialty_id = sp.specialty_id
      JOIN department d ON sg.department_id = d.department_id
      `
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Отримати деталі студента
router.get('/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT s.student_id, s.first_name, s.last_name, s.email, s.phone_number,
            TO_CHAR(s.date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
            sg.group_name, sp.specialty_name, d.department_name,
            t.first_name AS teacher_first_name, t.last_name AS teacher_last_name
      FROM student s
      JOIN students_group sg ON s.group_id = sg.group_id
      JOIN specialty sp ON sg.specialty_id = sp.specialty_id
      JOIN department d ON sg.department_id = d.department_id
      JOIN teacher t ON sg.teacher_id = t.teacher_id
      WHERE s.student_id = $1
      `,
      [student_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Оновити студента
router.patch('/:id/contact-info', async (req, res) => {
  try {
    console.log(`Updating contact info for student ID: ${req.params.id}, data:`, req.body);
    const { first_name, last_name, email, phone_number, date_of_birth } = req.body;

    // Перевірка обов'язкових полів
    if (!first_name || !last_name || !email) {
      console.log(`Missing required fields:`, { first_name, last_name, email });
      return res.status(400).json({ error: 'Обов’язкові поля: first_name, last_name, email' });
    }

    const result = await pool.query(
      `UPDATE student 
       SET first_name = $1, last_name = $2, email = $3, phone_number = $4, date_of_birth = $5
       WHERE student_id = $6 
       RETURNING student_id, first_name, last_name, email, phone_number, 
                 TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth`,
      [first_name, last_name, email, phone_number || null, date_of_birth || null, req.params.id]
    );

    if (result.rows.length === 0) {
      console.log(`Student with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Студента не знайдено' });
    }

    console.log(`Student updated:`, result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error in PATCH /students/:id/contact-info:`, error.stack);
    res.status(500).json({ error: 'Помилка сервера', details: error.message });
  }
});

// Видалити студента
router.delete('/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM student WHERE student_id = $1 RETURNING *', [student_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/contact-info', async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, date_of_birth } = req.body;
    const result = await pool.query(
      `UPDATE student 
      SET first_name = $1, last_name = $2, email = $3, phone_number = $4, date_of_birth = $5
      WHERE student_id = $6 
      RETURNING student_id, first_name, last_name, email, phone_number, 
               TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth,
               group_id, specialty_id, department_id, teacher_id, year_of_creating`,
      [first_name, last_name, email, phone_number || null, date_of_birth || null, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Студента не знайдено' });
    }
    const student = result.rows[0];
    const group = await pool.query('SELECT group_name FROM group_table WHERE group_id = $1', [student.group_id]);
    const specialty = await pool.query('SELECT specialty_name FROM specialty WHERE specialty_id = $1', [student.specialty_id]);
    const department = await pool.query('SELECT department_name FROM department WHERE department_id = $1', [student.department_id]);
    const teacher = student.teacher_id 
      ? await pool.query('SELECT first_name AS teacher_first_name, last_name AS teacher_last_name FROM teacher WHERE teacher_id = $1', [student.teacher_id])
      : { rows: [{ teacher_first_name: null, teacher_last_name: null }] };
  
    res.json({
      ...student,
      group_name: group.rows[0]?.group_name,
      specialty_name: specialty.rows[0]?.specialty_name,
      department_name: department.rows[0]?.department_name,
      teacher_first_name: teacher.rows[0]?.teacher_first_name,
      teacher_last_name: teacher.rows[0]?.teacher_last_name,
    });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;