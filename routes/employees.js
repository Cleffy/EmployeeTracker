const router = require('express').Router();
const {
    getAllEmployees,
    getEmployee,
    getManagersEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee } = require('../controller/employees')

/**
 * View all employees
 */
router.get('/', async (request, response) => {
    try{
        const result = await getAllEmployees();
        if(!result){
            response.status(400).json({ message: 'Unable to retrieve employees.' });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * View an employee
 * @param {INT} - ID of the employee
 */
router.get('/:id', async (request, response) => {
    try{
        const result = await getEmployee(request.params.id);
        if(!result){
            response.status(400).json({ message: 'Unable to retrieve employee.' });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * View all employees under a manager
 * @param {INT} - ID of the manager
 */
router.get('/manager/:id', async (request, response) => {
    try{
        const result = await getManagersEmployees(request.params.id);
        if(!result){
            response.status(400).json({ message: `Unable to retrieve employees under manager ${request.params.id}.` });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * Add an employee
 * @body JSON Object
 * {
 *  first_name: {STRING}
 *  last_name: {STRING}
 *  role_id: {INT}
 *  manager_id: {INT}
 * }
 */
router.post('/', async (request, response) => {
    try{
        const { first_name, last_name, role_id, manager_id } = request.body;
        const result = await createEmployee(first_name, last_name, role_id, manager_id);
        if(!result){
            response.status(400).json({ message: `Unable to add employee ${first_name}, ${last_name}.` });
            return;
        }
        response.status(201).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * Update an employee
 * @param {INT} id -ID of the employee
 * @body JSON Object
 * {
 *  first_name: {STRING}
 *  last_name: {STRING}
 *  role_id: {INT}
 *  manager_id: {INT}
 * }
 */
router.put('/:id', async (request, response) => {
    try{
        const { first_name, last_name, role_id, manager_id } = request.body;
        const result = await updateEmployee(first_name, last_name, role_id, manager_id, request.params.id);
        if(!result){
            response.status(400).json({ message: `Unable to update employee ${request.params.id}.` });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * Delete a employee
 * @param {INT} id - ID of the employee
 */
router.delete('/:id', async (request, response) => {
    try{
        const result = await deleteEmployee(request.params.id);
        if(!result){
            response.status(400).json({ message: `Unable to delete employee ${request.params.id}.` });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

module.exports = router;