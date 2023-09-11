const dataPool = require('../database');

/**
 * getAllEmployees
 * @returns - All employees
 * 
 * Queries the mySQL pool for all employees.
 */
async function getAllEmployees(){
    try{
        const [result] = await dataPool.query('SELECT * FROM employees;');
        console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}


/**
 * getEmployee
 * @param {INT} id - ID of the employee
 * @returns - A employee
 * 
 * Queries the mySQL pool for an employee.
 */
async function getEmployee(id){
    try{
        const [result] = await dataPool.query(`
            SELECT * FROM employees
            WHERE id = ?
            ;`, [id]);
        //console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getAllManagers
 * @returns - All managers
 * 
 * Queries the mySQL pool for all employees with a manager or owner role
 */
async function getAllManagers(){
    try{
        const [result] = await dataPool.query(`
            SELECT * 
            FROM roles 
            JOIN employees 
            ON employees.role_id = roles.id
            WHERE roles.title = ? || roles.title = ?
            ;`, ['Manager', 'Owner']);
        console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getManagersEmployees
 * @param {INT} id - ID of the manager
 * @returns - All the employees under a manager
 * 
 * Queries the mySQL pool for all employees under a manager.
 */
async function getManagersEmployees(id){
    try{
        const [result] = await dataPool.query(`
            SELECT * FROM employees
            WHERE manager_id = ?
            ;`, [id]);
        console.log(result);
        return result;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getDepartmentsEmployees
 * @param {INT} id - ID of the department
 * @returns - All the employees in a department
 * 
 * Queries the mySQL pool for all employees in a department.
 */
async function getDepartmentsEmployees(id){
    try{
        const [result] = await dataPool.query(`
            SELECT *
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
 * createEmployee
 * @param {STRING} first_name - Title of the employee
 * @param {STRING} last_name - Title of the employee
 * @param {INT} role_id - Salary of the employee
 * @param {INT} manager_id - ID of the department for the Employee
 * @returns - The created employee
 * 
 * Inserts an employee into the mySQL pool.
 */
async function createEmployee(first_name, last_name, role_id, manager_id){
    try{
        const [result] = await dataPool.query(`
            INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)
            ;`, [first_name, last_name, role_id, manager_id]);
        const createdObject = getEmployee(result.insertId);
        console.log(createdObject);
        return createdObject;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * updateEmployee
 * @param {STRING} first_name - Employee's first name
 * @param {STRING} last_name - Employee's last name
 * @param {INT} role_id - Employee's role id
 * @param {INT} manager_id - Employee's manager id
 * @param {INT} id - Employee's id
 * @returns - The updated employee
 * 
 * Checks to see which values are passed.
 * Updates the mySQL pool for an employee.
 */
async function updateEmployee(first_name, last_name, role_id, manager_id, id){
    try{
        if(id === undefined){
            console.log('No employee id defined.');
            return;
        }
        const employee = await getEmployee(id);
        if(first_name === undefined){
            first_name = employee.first_name;
        }
        if(last_name === undefined){
            last_name = employee.last_name;
        }
        if(role_id === undefined){
            role_id = employee.role_id;
        }
        if(manager_id === undefined){
            manager_id = employee.manager_id;
        }
        await dataPool.query(`
            UPDATE employees
            SET
                first_name = ?,
                last_name = ?,
                role_id = ?,
                manager_id = ?
            WHERE id = ?
            ;`, [first_name, last_name, role_id, manager_id, id]);
        const updatedObject = await getEmployee(id);
        console.log(updatedObject);
        return updatedObject;
    }
    catch(error){
        console.error(error);
    }
}

/**
 * deleteEmployee
 * @param {INT} id - ID of the employee
 * @returns - The deleted employee
 * 
 * Deletes a employee from the mySQL pool.
 */
async function deleteEmployee(id){
    try{
        const deletedObject = getEmployee(id);
        if(!deletedObject){
            console.log('Unable to get employee');
            return;
        }
        await dataPool.query(`
            DELETE FROM employees
            WHERE id = ?
            ;`, [id]);
        console.log(deletedObject);
        return deletedObject;
    }
    catch(error){
        console.error(error);
    }
}

module.exports = { getAllEmployees, getEmployee, getAllManagers, getManagersEmployees, getDepartmentsEmployees, createEmployee, updateEmployee, deleteEmployee };