const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// GET /reports/group-performance/:group_id
router.get('/group-performance/:group_id', async (req, res) => {
  try {
    console.log(`Fetching performance report for group_id: ${req.params.group_id}`);
    const groupId = parseInt(req.params.group_id);

    if (isNaN(groupId)) {
      console.log('Invalid group_id provided');
      return res.status(400).json({ error: 'Невалідний ідентифікатор групи' });
    }

    // Запит для group_info
    const groupInfoResult = await pool.query(
      `SELECT 
          sg.group_id,
          sg.group_name,
          d.department_name,
          sp.specialty_name,
          COUNT(st.student_id) AS student_count
       FROM students_group sg
       LEFT JOIN department d ON sg.department_id = d.department_id
       LEFT JOIN specialty sp ON sg.specialty_id = sp.specialty_id
       LEFT JOIN student st ON sg.group_id = st.group_id
       WHERE sg.group_id = $1
       GROUP BY sg.group_id, sg.group_name, d.department_name, sp.specialty_name`,
      [groupId]
    );

    if (groupInfoResult.rows.length === 0) {
      console.log(`Group not found for group_id: ${groupId}`);
      return res.status(404).json({ error: 'Групу не знайдено' });
    }

    // Запит для student_ranking
    const studentRankingResult = await pool.query(
      `SELECT 
          st.student_id,
          st.last_name || ' ' || st.first_name AS full_name,
          COALESCE(AVG(g.grade), 0) AS average_grade
       FROM student st
       LEFT JOIN grade g ON st.student_id = g.student_id
       WHERE st.group_id = $1
       GROUP BY st.student_id, st.first_name, st.last_name
       ORDER BY average_grade DESC`,
      [groupId]
    );

    // Запит для low_grades
    const lowGradesResult = await pool.query(
      `SELECT 
          s.subject_id,
          s.subject_name,
          st.student_id,
          st.last_name || ' ' || st.first_name AS full_name,
          g.grade
       FROM grade g
       JOIN student st ON g.student_id = st.student_id
       JOIN subject s ON g.subject_id = s.subject_id
       WHERE st.group_id = $1 
         AND g.grade < 60
       ORDER BY s.subject_name, st.last_name, st.first_name`,
      [groupId]
    );

    const response = {
      group_info: groupInfoResult.rows[0],
      student_ranking: studentRankingResult.rows,
      low_grades: lowGradesResult.rows,
    };

    console.log(`Performance report fetched:`, response);
    res.json(response);
  } catch (error) {
    console.error(`Error in GET /reports/group-performance/:group_id:`, error.stack);
    res.status(500).json({ error: 'Помилка сервера', details: error.message });
  }
});

// GET /reports/search-groups?name=<group_name>
router.get('/search-groups', async (req, res) => {
  try {
    const groupName = req.query.name;
    console.log(`Searching groups with name: ${groupName}`);

    if (!groupName) {
      console.log('Missing group name parameter');
      return res.status(400).json({ error: 'Необхідно вказати назву групи' });
    }

    const result = await pool.query(
      `SELECT group_id, group_name
       FROM students_group
       WHERE group_name ILIKE $1
       ORDER BY group_name`,
      [`%${groupName}%`]
    );

    console.log(`Groups found:`, result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error in GET /reports/search-groups:`, error.stack);
    res.status(500).json({ error: 'Помилка сервера', details: error.message });
  }
});

module.exports = router;