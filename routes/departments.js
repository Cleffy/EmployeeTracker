const router = require('express').Router();
const {
    getAllDepartments,
    getDepartment,
    getSalaryBudget, 
    createDepartment,
    deleteDepartment, 
    updateDepartment} = require('../controller/departments');

/**
 * View all departments
 */
router.get('/', async (request, response) => {
    try{
        const result = await getAllDepartments();
        if(!result){
            response.status(400).json({ message: 'Unable to retrieve departments.' });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * View a department
 * @param {INT} id - ID of the department
 */
router.get('/:id', async (request, response) => {
    try{
        const result = await getDepartment(request.params.id);
        if(!result){
            response.status(400).json({ message: 'Unable to retrieve department.' });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * View the total salary budget
 * @param {INT} id - ID of the department
 */
router.get('/budget/:id', async (request, response) => {
    try{
        const result = await getSalaryBudget(request.params.id);
        if(!result){
            response.status(400).json({ message: `Unable to find department ${request.params.id}.` });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * Add a department
 * @body JSON Object
 * {
 *  "name": {STRING}
 * }
 */
router.post('/', async (request, response) => {
    try{
        const { name } = request.body;
        const result = await createDepartment(name);
        if(!result){
            response.status(400).json({ message: `Unable to create department ${request.params.name}.` });
            return;
        }
        response.status(201).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * Update a department
 * @param {INT} id -ID of the department
 * @body JSON Object
 * {
 *  "name": {STRING}
 * }
 */
router.put('/:id', async (request, response) => {
    try{
        const { name } = request.body;
        const result = await updateDepartment(name, request.params.id);
        if(!result){
            response.status(400).json({ message: `Unable to update department ${request.params.id}.` });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * Delete a department
 * @param {INT} id - ID of the department
 */
router.delete('/:id', async (request, response) => {
    try{
        const result = await deleteDepartment(request.params.id);
        if(!result){
            response.status(400).json({ message: `Unable to delete department ${request.params.id}.` });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

module.exports = router;