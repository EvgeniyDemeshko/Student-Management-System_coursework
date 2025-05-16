const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET /transfers/departments
router.get('/departments', async (req, res) => {
  try {
    console.log('Fetching departments');
    const result = await pool.query('SELECT department_id, department_name FROM department ORDER BY department_name');
    console.log(`Departments fetched:`, result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error in GET /transfers/departments:`, error.stack);
    res.status(500).json({ error: 'Помилка сервера', details: error.message });
  }
});

// GET /transfers/specialties
router.get('/specialties', async (req, res) => {
  try {
    const department_id = req.query.department_id;
    console.log(`Fetching specialties for department_id: ${department_id}`);
    const query = department_id
      ? 'SELECT specialty_id, specialty_name FROM specialty WHERE department_id = $1 ORDER BY specialty_name'
      : 'SELECT specialty_id, specialty_name FROM specialty ORDER BY specialty_name';
    const params = department_id ? [department_id] : [];
    const result = await pool.query(query, params);
    console.log(`Specialties fetched:`, result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error in GET /transfers/specialties:`, error.stack);
    res.status(500).json({ error: 'Помилка сервера', details: error.message });
  }
});

// GET /transfers/groups
router.get('/groups', async (req, res) => {
  try {
    const specialty_id = req.query.specialty_id;
    console.log(`Fetching groups for specialty_id: ${specialty_id}`);
    const query = specialty_id
      ? 'SELECT group_id, group_name FROM group_table WHERE specialty_id = $1 ORDER BY group_name'
      : 'SELECT group_id, group_name FROM group_table ORDER BY group_name';
    const params = specialty_id ? [specialty_id] : [];
    const result = await pool.query(query, params);
    console.log(`Groups fetched:`, result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error in GET /transfers/groups:`, error.stack);
    res.status(500).json({ error: 'Помилка сервера', details: error.message });
  }
});

// PATCH /transfers/students/:id
router.patch('/students/:id', async (req, res) => {
  try {
    console.log(`Transferring student ID: ${req.params.id}, data:`, req.body);
    const { group_id } = req.body;

    if (!group_id) {
      console.log(`Missing required field: group_id`);
      return res.status(400).json({ error: 'Обов’язкове поле: group_id' });
    }

    console.log('Updating student with group_id:', group_id);
    const result = await pool.query(
      `UPDATE student 
       SET group_id = $1
       WHERE student_id = $2 
       RETURNING student_id, first_name, last_name, email, phone_number, 
                 TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth, 
                 group_id`,
      [group_id, req.params.id]
    );

    if (result.rows.length === 0) {
      console.log(`Student with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Студента не знайдено' });
    }

    const student = result.rows[0];
    console.log(`Student updated:`, student);

    console.log('Fetching group details for group_id:', student.group_id);
    const groupResult = await pool.query(
      `SELECT g.group_id, g.group_name, g.specialty_id, sp.specialty_name, 
              g.department_id, d.department_name, g.teacher_id, 
              t.first_name AS teacher_first_name, t.last_name AS teacher_last_name,
              g.year_of_creating
       FROM students_group g
       LEFT JOIN specialty sp ON g.specialty_id = sp.specialty_id
       LEFT JOIN department d ON g.department_id = d.department_id
       LEFT JOIN teacher t ON g.teacher_id = t.teacher_id
       WHERE g.group_id = $1`,
      [student.group_id]
    );

    if (!groupResult.rows[0]) {
      console.log(`Group not found for group_id: ${student.group_id}`);
      return res.status(400).json({ error: 'Групу не знайдено' });
    }

    console.log('Group details fetched:', groupResult.rows[0]);
    const response = {
      ...student,
      group_name: groupResult.rows[0].group_name,
      specialty_id: groupResult.rows[0].specialty_id,
      specialty_name: groupResult.rows[0].specialty_name,
      department_id: groupResult.rows[0].department_id,
      department_name: groupResult.rows[0].department_name,
      teacher_id: groupResult.rows[0].teacher_id,
      teacher_first_name: groupResult.rows[0].teacher_first_name,
      teacher_last_name: groupResult.rows[0].teacher_last_name,
      year_of_creating: groupResult.rows[0].year_of_creating,
    };

    console.log(`Sending response:`, response);
    res.json(response);
  } catch (error) {
    console.error(`Error in PATCH /transfers/students/:id:`, error.stack);
    res.status(500).json({ error: 'Помилка сервера', details: error.message });
  }
});

module.exports = router;