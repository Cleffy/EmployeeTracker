const dataPool = require('../database');

/**
 * getAllRoles
 * @returns - All roles
 * 
 * Queries the mySQL pool for all roles.
 */
async function getAllRoles(){
    try{
        const [result] = await dataPool.query('SELECT * FROM roles;');
        console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getRole
 * @param {INT} id - ID of the role
 * @returns - A role
 * 
 * Queries the mySQL pool for a role.
 */
async function getRole(id){
    try{
        const [result] = await dataPool.query(`
            SELECT * FROM roles
            WHERE id = ?
            ;`, [id]);
        console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * createRole
 * @param {STRING} title - Title of the role
 * @param {DECIMAL} salary - Salary of the role
 * @param {INT} department_id - ID of the department for the Role
 * @returns - The created role
 * 
 * Inserts a role.
 */
async function createRole(title, salary, department_id){
    try{
        const [result] = await db.query(`
            INSERT INTO departments (title, salary, department_id)
            VALUES (?, ?, ?)
            ;`, [title, salary, department_id]);
        const createdObject = getRole(result.insertId);
        console.log(createdObject);
        return createdObject;
    }
    catch(error){
        console.error(error);
    }

}

/**
 * deleteRole
 * @param {INT} id - ID of the role
 * @returns - The deleted role
 * 
 * Deletes a role.
 */
async function deleteRole(id){
    try{
        const deletedObject = getDepartment(id);
        if(!deletedObject){
            console.log('Unable to get role');
            return;
        }
        await db.query(`
            DELETE FROM roles
            WHERE id = ?
            ;`, [id]);
        console.log(deletedObject);
        return deletedObject;
    }
    catch(error){
        console.error(error);
    }
}

module.exports = { getAllRoles, getRole, createRole, deleteRole };