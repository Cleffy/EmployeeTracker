const router = require('express').Router();
const db = require('../database').databaseConnection;

/**
 * View all departments
 */
router.get('/', async (request, response) => {
    try{
        let sql = 'SELECT * FROM departments';

        db.query(sql, (error, result) => {
            if(error){
                console.error(error);
                response.status(500).send({ message: 'Failed to get all departments'});
            }
            console.log(result);
            response.status(200).json(result);
        });
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * View the total salary budget
 */
router.get('/budget/:id', async (request, response) => {
    let sql = //?????
        'SELECT COUNT(roles.salary) AS total_salary' + 
        'FROM employees' + 
        'JOIN roles' +
        'ON roles.id = employees.role_id' +
        `WHERE roles.department_id = ${request.params.id}`;

    db.query(sql, (error, result) => {
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
router.post('/:name', async (request, response) => {
    try{
        let sql = 
            'INSERT INTO departments (department_name)' +
            `VALUES (${request.params.name})`;

        db.query(sql, (error, result) => {
            if(error){
                console.error(error);
                response.status(500).send({ message: 'Failed to add a new department.' });
            }
            console.log(result);
            response.status(200).send({ message: 'Created a new department.' });
        });
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * Delete a department
 */
router.delete('/:id', async (request, response) => {
    try{
        let sql = 
            'DELETE FROM departments' +
            `WHERE id = ${request.params.id}`;

        db.query(sql, (error, result) => {
            if(error){
                console.error(error);
            }
            console.log(result);
            response.status(200).json(result);
        });
    }
    catch(error){
        response.status(500).json(error);
    }
});

module.exports = router;