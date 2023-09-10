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
        const [result] = await dataPool.query(`
            INSERT INTO roles (title, salary, department_id)
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
 * updateRole
 * @param {STRING} title - Title of the role
 * @param {DECIMAL} salary - Salary of the role
 * @param {INT} department_id - ID of the department for the Role
 * @param {INT} id - Role's id
 * @returns - The updated role
 * 
 * Checks to see which values are passed.
 * Updates the mySQL pool for a role.
 */
async function updateRole(title, salary, department_id, id){
    try{
        if(id = undefined){
            console.log('No role id defined.');
            return;
        }
        const role = getRole(id);
        if(title = undefined){
            title = role.title;
        }
        if(salary = undefined){
            salary = role.salary;
        }
        if(department_id = undefined){
            department_id = role.department_id;
        }
        const [result] = await dataPool.query(`
            UPDATE roles
            SET
                title = ?,
                salary = ?,
                department_id = ?,
            WHERE id = ?
            ;`, [title, salary, department_id, id]);
        const updatedObject = getRole(result.insertId);
        console.log(updatedObject);
        return updatedObject;
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
        const deletedObject = getRole(id);
        if(!deletedObject){
            console.log('Unable to get role');
            return;
        }
        await dataPool.query(`
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

module.exports = { getAllRoles, getRole, createRole, updateRole, deleteRole };