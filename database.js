const mysql = require('mysql2');        // Require mysql2
require('dotenv').config();

// Create a database connection
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

// Connect to the database
db.connect((error => {
    if(error){
        console.error(error);
    }
    console.log(`Connected to database ${process.env.DB_NAME}`);
}));

// Export database connection
exports.databaseConnection = db;
