const { Pool } = require("pg");

// Створюємо пул підключень
const pool = new Pool({
    user: "postgres",
    password: "12345",
    database: "account_master",
    host: "127.0.0.1",
    port: 5432, 
    max: 10,
});

// Перевіряємо підключення
pool.connect((err, client, release) => {
    if (err) {
        console.error("Error connecting to PostgreSQL:", err.stack);
        throw err; // Кидаємо помилку для подальшого аналізу
    }
    console.log("Connected to PostgreSQL DB successfully");
    release(); // Звільняємо клієнта назад у пул
});

module.exports = pool;