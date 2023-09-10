const router = require('express').Router();
const {
    getAllRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole } = require('../controller/roles')

/**
 * View all roles
 */
router.get('/', async (request, response) => {
    try{
        const result = await getAllRoles();
        if(!result){
            response.status(400).json({ message: 'Unable to retrieve roles.' });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * View a role
 * @param {INT} - ID of the role
 */
router.get('/:id', async (request, response) => {
    try{
        const result = await getRole(request.params.id);
        if(!result){
            response.status(400).json({ message: 'Unable to retrieve role.' });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * Add a role
 * @body JSON Object
 * {
 *  title: {STRING}
 *  salary: {DECIMAL}
 *  department_id: {INT}
 * }
 */
router.post('/', async (request, response) => {
    try{
        const {title, salary, department_id} = request.body;
        const result = await createRole(title, salary, department_id);
        if(!result){
            response.status(400).json({ message: `Unable to create role ${title}.` });
            return;
        }
        response.status(201).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

/**
 * Update a role
 * @param {INT} id -ID of the role
 * @body JSON Object
 * {
 *  title: {STRING}
 *  salary: {DECIMAL}
 *  department_id: {INT}
 * }
 */
router.put('/:id', async (request, response) => {
    try{
        const {title, salary, department_id} = request.body;
        const result = await updateRole(title, salary, department_id, request.params.id);
        if(!result){
            response.status(400).json({ message: `Unable to update role ${request.params.id}.` });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});


/**
 * Delete a role
 * @param {INT} id - ID of the role
 */
router.delete('/:id', async (request, response) => {
    try{
        const result = await deleteRole(request.params.id);
        if(!result){
            response.status(400).json({ message: `Unable to delete role ${request.params.id}.` });
            return;
        }
        response.status(200).json(result);
    }
    catch(error){
        response.status(500).json(error);
    }
});

module.exports = router;