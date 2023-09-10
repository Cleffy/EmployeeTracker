const dataPool = require('../database');

/**
 * getAllDepartments
 * @returns all departments
 * 
 * Gets all the departments.
 */
async function getAllDepartments(){
    try{
        const [result] = await dataPool.query('SELECT * FROM departments');
        console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getSalaryBudget
 * @param {*} id 
 * @returns the sum of the salaries of all employees within a department
 * 
 * Gets the total budget on employee salaries within a department.
 */
async function getSalaryBudget(id){
    try{
        const [result] = await dataPool.query(`
            SELECT COUNT(roles.salary) AS total_salary
            FROM employees
            JOIN roles
            ON roles.id = employees.role_id
            WHERE roles.department_id = ?
            `, [id]);
        console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * createDepartment
 * @param {*} name 
 * @returns an object representing the new department
 * 
 * Creates a department.
 */
async function createDepartment(name){
    try{
        const [result] = await db.query(`
            INSERT INTO departments (department_name)
            VALUES (?)
            `, [name]);
        const createdObject = {
            id: result.insertId,
            department_name: name
        }
        console.log(createdObject);
        return createdObject;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * deleteDepartment
 * @param {*} id 
 * 
 * Deletes a department.
 */
async function deleteDepartment(id){
    try{
        db.query(`DELETE FROM departments
            WHERE id = $
            `, [id]);
        console.log('Deleted department.');
    }
    catch(error){
        console.error(error);
    }
}

module.exports = { getAllDepartments, getSalaryBudget, createDepartment, deleteDepartment };