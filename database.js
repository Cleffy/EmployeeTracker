const mysql = require('mysql2');        // Require mysql2
require('dotenv').config();

// Create a database pool
const dataPool = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

// Export database pool
module.exports = dataPool.promise();
