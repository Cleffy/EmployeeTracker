const router = require('express').Router();
const connection = require('./database').databaseConnection;

/**
 * View all departments
 */
router.get('/getAllDepartments', (request, response) => {
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
router.get('/getSalaryBudget/:id', (request, response) => {
    let sql = //?????
        'SELECT COUNT' + 
        'FROM employees' + 
        'WHERE ';

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

/**
 * Delete a department
 */

module.exports = router;