
const express = require('express');     // Require express
const mysql = require('mysql2');        // Require mysql2
const dotenv = require('dotenv');       // Require dotenv

const PORT = process.env.PORT || 3001;  // Create port
const app = express();                  // Initialize express

// Describe express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to a database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

/**
 *      ROUTES
 */

// View all departments
// View the total utilized budget of a department
// Add a department
// Delete a department

// View all roles
// Add a role
// Delete a role

// View all employees
// View employees by manager
// Add an employee
// Update an employee
// Update an employee's manager
// Delete an employee

// Create route for unspecified request
app.use((req, res) => {
    res.status(404).end();
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is now runing on port ${PORT}`);
});