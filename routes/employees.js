const router = require('express').Router();
const connection = require('../database').databaseConnection;

/**
 * View all employees
 */
router.get('/', (request, response) => {
    let sql = 'SELECT * FROM employees';

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to get all employees'});
        }
        console.log(result);
        response.status(200).send({ message: 'Returned all employees' });
    });
});
 
/**
 * View employees by manager
 */
router.get('/:id', (request, response) => {
    let sql = 'SELECT * FROM employees' +
        `WHERE manager_id = ${request.params.id}`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: "Failed to get all of this manager's employees"});
        }
        console.log(result);
        response.status(200).send({ message: "Returned all of this manager's employees" });
    });
});

/**
* Add an employee
*/
router.post('/', (request, response) => {
    let sql = 
        'INSERT INTO employees (first_name, last_name, role_id, manager_id)' +
        `VALUES (
            ${request.body.first_name}, 
            ${request.body.last_name}, 
            ${request.body.role_id},
            ${request.body.manager_id})`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to add a new employee.' });
        }
        console.log(result);
        response.status(200).send({ message: 'Created a new employee.' });
    });
});

/**
 * Update an employee
 */
router.put('/:id', (request, response) => {
    let sql = 
        'UPDATE employees' +
        `SET 
            first_name = ${request.body.first_name}, 
            last_name = ${request.body.last_name}, 
            role_id = ${request.body.role_id},
            manager_id = ${request.body.manager_id})` +
        `WHERE id = ${request.params.id}`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to update an employee.' });
        }
        console.log(result);
        response.status(200).send({ message: 'Updated an employee.' });
    });
});

/**
 * Update an employee's manager
 */
router.put('/:id&:manager_id', (request, response) => {
    let sql = 
        'UPDATE employees' +
        `SET manager_id = ${request.params.manager_id})` +
        `WHERE id = ${request.params.id}`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: "Failed to update an employee's manager." });
        }
        console.log(result);
        response.status(200).send({ message: "Updated an employee's manager." });
    });
});

/**
 * Delete an employee
 */
router.delete('/:id', (request, response) => {
    let sql = 
        'DELETE FROM employees' +
        `WHERE id = ${request.params.id}`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to delete an employee.' });
        }
        console.log(result);
        response.status(200).send({ message: 'Deleted an employee.' });
    });
});


module.exports = router;