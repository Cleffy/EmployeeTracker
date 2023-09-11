/**
 * Employees Menu
 * > View all employees
 *   --List all employees
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * > View all of a manager's employees
 *   --List employees
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * > View all employees in a department
 *   --List employees
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * > Add an employee
 *   [] Input first_name, last_name, pick role, pick manager
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * > Update an employee
 *  [>] Pick an employee
 *     [] Input first_name, last_name, pick role, pick manager
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * > Delete an employee
 *  [>] Pick an employee
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * >  Return to Main Menu
 * >  Exit
 */

const inquirer = require('inquirer');
require('dotenv').config();
const URL = `http://${process.env.DB_HOST}:${process.env.PORT}`;
const { pickDepartment, getDepartment } = require('./departments');
const { pickRole, getRole } = require('./roles');

/**
 * displayEmployeeMenu
 * @returns - Next state
 * 
 * Asks the user how they would like to manage employees
 */
async function displayEmployeeMenu(){
    try{
        const result = await inquirer.prompt([
            {
                type: 'list',
                name: 'task',
                message: "How would you like to manage the employees?",
                choices: [
                    {
                        name: "View all employees",
                        value: 'viewEmployees'
                    },
                    {
                        name: "View employees under a manager",
                        value: 'viewManagerEmployees'
                    },
                    {
                        name: "View employees within a department",
                        value: 'viewDepartmentEmployees'
                    },
                    {
                        name: "Add an employee",
                        value: 'addEmployee'
                    },
                    {
                        name: "Update an employee",
                        value: 'updateEmployee'
                    },
                    {
                        name: "Delete an employee",
                        value: 'deleteEmployee'
                    },
                    {
                        name: "Return to Main Menu",
                        value: 'mainMenu'
                    },
                    {
                        name: "Exit",
                        value: 'exit'
                    }
                ]
            }
        ]);
        return Promise.resolve(result.task)
    }
    catch(error){
        console.error(error);
    }
}

/**
 * viewAllEmployees
 * @returns - Next state
 * 
 * Displays all employees by Name, Department, Role, Salary, and Manager
 * Asks the user what they want to do next
 */
async function viewAllEmployees(){
    try{
        let employees = await getAllEmployees();
        for(let employee of employees){
            employee = await formatEmployee(employee);
        }
        console.log(buildTable(employees));
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * viewManagerEmployees
 * @returns - Next state
 * 
 * Displays manager's employees by Name, Department, Role, Salary, and Manager
 * Asks the user what they want to do next
 */
async function viewManagerEmployees(){
    try{
        let employees = await getManagerEmployees();
        for(let employee of employees){
            employee = await formatEmployee(employee);
        }
        console.log(buildTable(employees));
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * viewDepartmentEmployees
 * @returns - Next state
 * 
 * Displays department's employees by Name, Department, Role, Salary, and Manager
 * Asks the user what they want to do next
 */
async function viewDepartmentEmployees(){
    try{
        let employees = await getDepartmentEmployees();
        for(let employee of employees){
            employee = await formatEmployee(employee);
        }
        console.log(buildTable(employees));
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * buildTable
 * @param {array} values 
 * @returns String of what is to be printed on console.
 * 
 * Makes a header
 * For each value it adds it to the body
 */
function buildTable(values){
    let header = 
        ` ${'Name'.padEnd(30)} |` +
        ` ${'Department'.padEnd(30)} |` +
        ` ${'Role'.padEnd(30)} |` +
        ` ${'Salary'.padEnd(15)} |` + 
        ` ${'Manager'.padEnd(30)}\n` +
        ` ${''.padEnd(30,'-')} +` +
        ` ${''.padEnd(30,'-')} +` +
        ` ${''.padEnd(30,'-')} +` +
        ` ${''.padEnd(15,'-')} +` +
        ` ${''.padEnd(30,'-')}\n`;
    let body = '';
    for(const value of values){
        body +=
            ` ${value.name.padEnd(30)} |` +
            ` ${value.department.padEnd(30)} |` +
            ` ${value.role.padEnd(30)} |` +
            ` ${value.salary.padStart(15)} |` +
            ` ${value.manager.padEnd(30)} \n`;
    }
    return header + body;
}

/**
 * addEmployee
 * @returns - Next state
 * 
 * Gets body.
 * Adds new employee to the backend.
 * Asks the user what they want to do next.
 */
async function addEmployee(){
    try{
        const body = await getBody();
        if(body === 'employeeMenu' || body === 'mainMenu' || body === 'exit'){
            return Promise.resolve(body);
        }

        const response = await fetch(URL + '/employees', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify(body)
        });
        const [employee] = await response.json();
        console.log( "Added employee: " + employee.first_name);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * updateEmployee
 * @returns - Next state
 * 
 * Asks the user to pick an employee.
 * Gets body.
 * Updates the employee in the backend
 * Asks the user what they want to do next.
 */
async function updateEmployee(){
    try{
        const result = await pickEmployee();
        if(result === 'employeeMenu' || result === 'mainMenu' || result === 'exit'){
            return Promise.resolve(result);
        }
        const body = await getBody();
        if(body === 'employeeMenu' || body === 'mainMenu' || body === 'exit'){
            return Promise.resolve(body);
        }

        const response = await fetch(URL + '/employees/' + result.id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify(body)
        });
        const [employee] = await response.json();
        console.log( "Updated role: " + employee.first_name);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * deleteEmployee
 * @returns - Next state
 * 
 * Asks the user to pick an employee.
 * Deletes the employee in the backend.
 * Asks the user what to do next.
 */
async function deleteEmployee(){
    try{
        const result = await pickEmployee();
        if(result === 'employeeMenu' || result === 'mainMenu' || result === 'exit'){
            return Promise.resolve(result);
        }
        const response = await fetch(URL + '/employees/' + result.id, {method: 'DELETE'});
        const [employee] = await response.json();
        console.log( "Deleted role: " + employee.first_name);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * pickEmployee
 * @returns - The employee object or next state
 * 
 * Gathers an array of employees from the backend.
 * Formats the selection for inquirer.
 * Asks the user to make a selection.
 */
async function pickEmployee(){
    try{
        const employees = await getAllEmployees();
        const selection = new Array();
        for(let employee of employees){
            employee = await formatEmployee(employee);
            let name = `${employee.name} - ${employee.role}`;
            selection.push({
                name: name,
                value: employee.id
            });
        }
        selection.push({
            name: "Back",
            value: 'employeeMenu'
        });
        selection.push({
            name: "Return to Main Menu",
            value: 'mainMenu'
        });
        selection.push({
            name: "Exit",
            value: "exit"
        });

        const result = await inquirer.prompt([
            {
                type: 'list',
                name: 'task',
                message: "Pick the employee?",
                choices: selection
            }
        ]);
        const task = result.task;
        if(result.task === 'employeeMenu' || result.task === 'mainMenu' || result.task === 'exit'){
            return Promise.resolve(task);
        }
        return await getEmployee(task);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * pickManager
 * @returns - The employee object or next state
 * 
 * Gathers an array of managers from the backend.
 * Formats the selection for inquirer.
 * Asks the user to make a selection.
 */
async function pickManager(){
    try{
        const managers = await getAllManagers();
        const selection = new Array();
        for(let manager of managers){
            manager = await formatEmployee(manager);
            let name = `${manager.name} - ${manager.role}`;
            selection.push({
                name: name,
                value: manager.id
            });
        }
        selection.push({
            name: "Back",
            value: 'employeeMenu'
        });
        selection.push({
            name: "Return to Main Menu",
            value: 'mainMenu'
        });
        selection.push({
            name: "Exit",
            value: "exit"
        });

        const result = await inquirer.prompt([
            {
                type: 'list',
                name: 'task',
                message: "Pick the manager?",
                choices: selection
            }
        ]);
        const task = result.task;
        if(result.task === 'employeeMenu' || result.task === 'mainMenu' || result.task === 'exit'){
            return Promise.resolve(task);
        }
        return await getEmployee(task);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getAllEmployees
 * @returns - An array of employees pulled from the backend.
 * 
 * Fetches an array of employees from the backend.
 */
async function getAllEmployees(){
    try{
        const response = await fetch(URL + '/employees', { method: 'GET' });
        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getAllManagers
 * @returns - An array of managers pulled from the backend.
 * 
 * Fetches an array of managers from the backend.
 */
async function getAllManagers(){
    try{
        const response = await fetch(URL + '/employees/manager', { method: 'GET' });
        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getManagerEmployees
 * @returns - An array of employees pulled from the backend.
 * 
 * Fetches an array of employees from the backend.
 */
async function getManagerEmployees(){
    try{
        manager = await pickManager();
        if(manager === 'employeeMenu' || manager === 'mainMenu' || manager === 'exit'){
            return Promise.resolve(manager);
        }

        const response = await fetch(URL + '/employees/manager/' + manager.id, { method: 'GET' });
        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getDepartmentEmployees
 * @returns - An array of employees pulled from the backend.
 * 
 * Fetches an array of employees from the backend.
 */
async function getDepartmentEmployees(){
    try{
        department = await pickDepartment();
        if(department === 'departmentMenu'){
            return Promise.resolve('employeeMenu')
        }
        if(department === 'mainMenu' || department === 'exit'){
            return Promise.resolve(department);
        }

        const response = await fetch(URL + '/employees/department/' + department.id, { method: 'GET' });
        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getEmployee
 * @param {INT} id - ID of employee
 * @returns - A employee object
 * 
 * Fetches an employee based on ID from the backend.
 * Pulls the object outside of the response array.
 */
async function getEmployee(id){
    try{
        const response = await fetch(URL + '/roles/' + id, { method: 'GET' });
        const [employee] = await response.json();
        return Promise.resolve(employee);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getBody
 * @returns - body object to adjust/create the values of a role
 * 
 * Asks the user for the first name.
 * Asks the user for the last name.
 * Asks the user for the role.
 * Asks the user for the manager.
 * Creates a body object.
 */
async function getBody(){
    try{
        const firstName = await getName('first');
        if(firstName === 'employeeMenu' || firstName === 'mainMenu' || firstName === 'exit'){
            return Promise.resolve(firstName);
        }
        const lastName = await getName('last');
        if(lastName === 'employeeMenu' || lastName === 'mainMenu' || lastName === 'exit'){
            return Promise.resolve(lastName);
        }
        const role = await pickRole();
        if(role === 'roleMenu'){
            return Promise.resolve('employeeMenu');
        }
        if(role === 'mainMenu' || role === 'exit'){
            return Promise.resolve(role);
        }
        const manager = await pickManager();
        if(manager === 'employeeMenu' || manager === 'mainMenu' || manager === 'exit'){
            return Promise.resolve(manager);
        }
        const body = {
            first_name: firstName,
            last_name: lastName,
            role_id = role.id,
            manager_id: manager.id
        };
        return Promise.resolve(body);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * formatEmployee
 * @param {employee} employee - employee object to be parsed
 * @returns formatted employee
 * 
 * Finds the role.
 * Finds the department.
 * Finds the manager.
 * Creates a new object with:
 *   {ID, Name, Department, Role, Salary, Manager}
 */
async function formatEmployee(employee){
    try{
        const manager = await getEmployee(employee.manager_id);
        const role = await getRole(employee.role_id);
        const department = await getDepartment(role.department_id);
        return Promise.resolve({
            id: employee.id,
            name: `${employee.first_name} ${employee.last_name}`,
            department: department.department_name,
            role: role.title,
            salary: "$ " + parseFloat(role.salary).toLocaleString(
                'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}
                ),
            manager: `${manager.first_name} ${manager.last_name}`
        });
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getName
 * @returns - The inputted name or the next state
 * 
 * Asks the user to input a name.
 * Checks to see if the input is valid.
 * Repeats the function if it is not.
 */
async function getName(alias){
    try{
        console.log("Enter 'Back' to return to the previous menu.");
        console.log("Enter 'Return' to return to the main menu.");
        console.log("Enter 'Exit' to quit.");
        const result = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 
                    `What's the ${alias} name of the employee?\n` +
                    "** Must be between 3 to 30 characters. **"
            }
        ]);
        let name = result.name;
        let nameTest = name.toLowerCase().replace(/\s/g, "");
        if(nameTest === 'back'){
            return Promise.resolve('employeeMenu');
        }
        if(nameTest === 'return'){
            return Promise.resolve('mainMenu');
        }
        if(nameTest === 'exit'){
            return Promise.resolve('exit');
        }
        if(name.length < 3 || name.length > 30){
            console.log("Didn't enter a name between 3 to 30 characters.")
            return await getName();
        }
        return Promise.resolve(name);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * finishedTask
 * @returns - The next state
 * 
 * Asks the user which menu they want to navigate to next.
 */
async function finishedTask(){
    try{
        const result = await inquirer.prompt([
            {
                type: 'list',
                name: 'task',
                message: "What task do you want to do next?",
                choices: [
                    {
                        name: "Back",
                        value: 'employeeMenu'
                    },
                    {
                        name: "Return to Main Menu",
                        value: 'mainMenu'
                    },
                    {
                        name: "Exit",
                        value: 'exit'
                    }
                ]
            }
        ]);
        return Promise.resolve(result.task);
    }
    catch(error){
        console.error(error);
    }
}

module.exports = { displayEmployeeMenu, viewAllEmployees, viewManagerEmployees, viewDepartmentEmployees, addEmployee, updateEmployee, deleteEmployee };