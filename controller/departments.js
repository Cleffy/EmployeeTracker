const dataPool = require('../database');

/**
 * getAllDepartments
 * @returns - All departments
 * 
 * Queries the mySQL pool for all departments.
 */
async function getAllDepartments(){
    try{
        const [result] = await dataPool.query('SELECT * FROM departments;');
        console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getDepartment
 * @param {INT} id - ID of the department
 * @returns - A department
 * 
 * Queries the mySQL pool for a department.
 */
async function getDepartment(id){
    try{
        const [result] = await dataPool.query(`
            SELECT * FROM departments
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
 * getSalaryBudget
 * @param {INT} id - ID of the department
 * @returns - The sum of the salaries of all employees within a department
 * 
 * Queries the mySQL pool for all employees within a department.
 * Checks each employees salary and adds them together.
 */
async function getSalaryBudget(id){
    try{
        const [result] = await dataPool.query(`
            SELECT COUNT(roles.salary) AS total_salary
            FROM employees
            JOIN roles
            ON roles.id = employees.role_id
            WHERE roles.department_id = ?
            ;`, [id]);
        console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * createDepartment
 * @param {STRING} name - Name of the new department
 * @returns - The created department
 * 
 * Inserts a department.
 */
async function createDepartment(name){
    try{
        const [result] = await db.query(`
            INSERT INTO departments (department_name)
            VALUES (?)
            ;`, [name]);
        const createdObject = getDepartment(result.insertId);
        console.log(createdObject);
        return createdObject;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * deleteDepartment
 * @param {INT} id - ID of the department
 * @returns - The deleted department
 * 
 * Deletes a department.
 */
async function deleteDepartment(id){
    try{
        const deletedObject = getDepartment(id);
        if(!deletedObject){
            console.log('Unable to get department');
            return;
        }
        await db.query(`
            DELETE FROM departments
            WHERE id = ?
            ;`, [id]);
        console.log(deletedObject);
        return deletedObject;
    }
    catch(error){
        console.error(error);
    }
}

module.exports = { getAllDepartments, getDepartment, getSalaryBudget, createDepartment, deleteDepartment };