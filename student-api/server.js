const express = require('express');
const cors = require('cors');
const studentsRouter = require('./routes/students');
const gradesRouter = require('./routes/grades');
const departmentsRouter = require('./routes/departments');
const specialtiesRouter = require('./routes/specialties');
const groupsRouter = require('./routes/groups');
const teachersRouter = require('./routes/teachers');
const subjectsRouter = require('./routes/subjects');
const transfersRouter = require('./routes/transfers');
const reportsRouter = require('./routes/reports');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/students', studentsRouter);
app.use('/api/grades', gradesRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/specialties', specialtiesRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/transfers', transfersRouter);
app.use('/api/reports', reportsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));