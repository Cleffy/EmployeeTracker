const router = require('express').Router();
const connection = require('./database').databaseConnection;

/**
 * View all departments
 */
router.get('/departments', (request, response) => {
    let sql = 'SELECT * FROM departments';

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to get all departments'});
        }
        console.log(result);
        response.status(200).send({ message: 'Returned all departments' });
    });
});

/**
 * View the total salary budget
 */
router.get('/departmentBudget/:id', (request, response) => {
    let sql = //?????
        'SELECT COUNT(roles.salary) AS total_salary' + 
        'FROM employees' + 
        'JOIN roles' +
        'ON roles.id = employees.role_id' +
        `WHERE roles.department_id = ${request.params.id}`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to get the total salary budget of the department' });
        }
        console.log(result);
        response.status(200).send({ message: 'Returned the total salary budget of the department' });
    });
});

/**
 * Add a department
 */
router.post('/departments/:name', (request, response) => {
    let sql = 
        'INSERT INTO departments (department_name)' +
        `VALUES (${request.params.name})`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to add a new department.' });
        }
        console.log(result);
        response.status(200).send({ message: 'Created a new department.' });
    });
});

/**
 * Delete a department
 */
router.delete('/departments/:id', (request, response) => {
    let sql = 
        'DELETE FROM departments' +
        `WHERE id = ${request.params.id}`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to delete a department.' });
        }
        console.log(result);
        response.status(200).send({ message: 'Deleted a department.' });
    });
});

module.exports = router;