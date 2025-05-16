const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  password: "12345",
  database: "students_system",
  host: "localhost",
  port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error("Error connecting to PostgreSQL:", err.stack);
        throw err;
    }
    console.log("Connected to PostgreSQL DB successfully");
    release();
});

module.exports = pool;