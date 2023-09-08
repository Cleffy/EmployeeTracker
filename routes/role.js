const router = require('express').Router();
const connection = require('./database').databaseConnection;

/**
 * View all roles
 */
router.get('/roles', (request, response) => {
    let sql = 'SELECT * FROM roles';

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to get all roles'});
        }
        console.log(result);
        response.status(200).send({ message: 'Returned all roles' });
    });
});

/**
 * Add a role
 */
router.post('/roles', (request, response) => {
    let sql = 
        'INSERT INTO roles (title, salary, department_id)' +
        `VALUES (
            ${request.body.title}, 
            ${request.body.salary}, 
            ${request.body.department_id})`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to add a new role.' });
        }
        console.log(result);
        response.status(200).send({ message: 'Created a new role.' });
    });
});


/**
 * Delete a role
 */
router.delete('/roles/:id', (request, response) => {
    let sql = 
        'DELETE FROM employees' +
        `WHERE id = ${request.params.id}`;

    connection.query(sql, (error, result) => {
        if(error){
            console.error(error);
            response.status(500).send({ message: 'Failed to delete a role.' });
        }
        console.log(result);
        response.status(200).send({ message: 'Deleted a role.' });
    });
});

module.exports = router;