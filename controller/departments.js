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
            SELECT SUM(salary) AS total_salary
            FROM employees
            JOIN roles
            ON employees.role_id = roles.id
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
        const [result] = await dataPool.query(`
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
 * updateDepartment
 * @param {STRING} name - Name of the department
 * @param {INT} id - Department's id
 * @returns - The updated department
 * 
 * Checks to see if a value is passed.
 * Updates the mySQL pool for a department.
 */
async function updateDepartment(name, id){
    try{
        if(name === undefined){
            console.log('No department name defined.');
            return;
        }
        if(id === undefined){
            console.log('No department id defined.');
            return;
        }
        await dataPool.query(`
            UPDATE departments
            SET department_name = "?"
            WHERE id = ?
            ;`, [name, id]);
        const updatedObject = await getDepartment(id);
        console.log(updatedObject);
        return updatedObject;
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
        await dataPool.query(`
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

module.exports = { getAllDepartments, getDepartment, getSalaryBudget, createDepartment, updateDepartment, deleteDepartment };