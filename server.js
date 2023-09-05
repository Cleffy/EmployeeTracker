
const express = require('express');     // Require express
const routes = require('./routes');     // Require routes folder

const PORT = process.env.PORT || 3001;  // Create port
const app = express();                  // Initialize express

// Describe express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 *      ROUTES
 */

app.use(routes);

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