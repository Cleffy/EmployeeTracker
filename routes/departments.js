const router = require('express').Router();
const {
    getAllDepartments,
    getSalaryBudget, 
    createDepartment,
    deleteDepartment } = require('../controller/departments');

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
 * View the total salary budget
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
 */
router.post('/:name', async (request, response) => {
    try{
        const result = await createDepartment(request.params.name);
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
 * Delete a department
 */
router.delete('/:id', async (request, response) => {
    try{
        await deleteDepartment(request.params.id);
        response.status(200).json({ message: "Deleted department." });
    }
    catch(error){
        response.status(500).json(error);
    }
});

module.exports = router;