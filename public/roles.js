/**
 * Roles Menu
 * >  View all roles
 * -- List all roles
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * >  See a role
 *  [>] Pick a role
 *     -- Show role title, salary, department
 *     >  Back
 *     >  Return to Main Menu
 *     >  Exit
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * >  Add a role
 *   [] Input title, salary, pick department / Exit / Back / Main Menu
 *   -- Return to role Menu
 * >  Update a role
 *  [>] Pick a role
 *     [] Input title, salary, pick department / Exit / Back / Main Menu
 *     -- Return to role Menu
 * >  Delete a role
 *  [>] Pick a role
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * >  Back
 * >  Exit
 */

const inquirer = require('inquirer');
require('dotenv').config();
const URL = `http://${process.env.DB_HOST}:${process.env.PORT}`;
const { pickDepartment, getDepartment } = require('./departments');

/**
 * displayRoleMenu
 * @returns - Next state
 * 
 * Asks the user what they would like to do in roles.
 */
async function displayRoleMenu(){
    try{
        const result = await inquirer.prompt([
            {
                type: 'list',
                name: 'task',
                message: "How would you like to manage the roles?",
                choices: [
                    {
                        name: "View all roles",
                        value: 'viewRoles'
                    },
                    {
                        name: "View a role",
                        value: 'viewRole'
                    },
                    {
                        name: "Add a role",
                        value: 'addRole'
                    },
                    {
                        name: "Update a role",
                        value: 'updateRole'
                    },
                    {
                        name: "Delete a role",
                        value: 'deleteRole'
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

/**
 * viewAllRoles
 * @returns - Next state
 * 
 * Displays all roles by ID, Title, Salary, and Department
 * Asks the user what they want to do next.
 */
async function viewAllRoles(){
    try{
        let roles = await getAllRoles();
        for(role of roles){
            role = await formatRole(role);
        }
        console.log(buildTable(roles));
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * viewRole
 * @returns - Next state
 * 
 * Asks the user to pick a role.
 * Displays that roles ID, Title, Salary, and Department
 * Asks the user what they want to do next.
 */
async function viewRole(){
    try{
        let role = await pickRole();
        role = await formatRole(role);
        console.log(buildTable([role]));
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
        ` ${'Department'.padEnd(30)} | ${'Title'.padEnd(30)} | ${'Salary'.padEnd(15)}\n` + 
        ` ${''.padEnd(30,'-')} + ${''.padEnd(30,'-')} + ${''.padEnd(15,'-')}\n`;
    let body = '';
    for(const value of values){
        body +=
            ` ${value.department.padEnd(30)} |` +
            ` ${value.title.padEnd(30)} |` +
            ` ${value.salary.padStart(15)} \n`
    }
    return header + body;
}

/**
 * addRole
 * @returns - Next state
 * 
 * Gets body.
 * Adds new role to the backend.
 * Asks the user what they want to do next.
 */
async function addRole(){
    try{
        const body = await getBody();
        if(body === 'roleMenu' || body === 'mainMenu' || body === 'exit'){
            return Promise.resolve(body);
        }

        const response = await fetch(URL + '/roles', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify(body)
        });
        const [role] = await response.json();
        console.log( "Added role: " + role.title);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * updateRole
 * @returns - Next state
 * 
 * Asks the user to pick a role.
 * Gets body.
 * Updates the role in the backend
 * Asks the user what they want to do next.
 */
async function updateRole(){
    try{
        const result = await pickRole();
        if(result === 'roleMenu' || result === 'mainMenu' || result === 'exit'){
            return Promise.resolve(result);
        }
        const body = await getBody();
        if(body === 'roleMenu' || body === 'mainMenu' || body === 'exit'){
            return Promise.resolve(body);
        }

        const response = await fetch(URL + '/roles/' + result.id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify(body)
        });
        const [role] = await response.json();
        console.log( "Updated role: " + role.title);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * deleteRole
 * @returns - Next state
 * 
 * Asks the user to pick a role.
 * Deletes the role in the backend.
 * Asks the user what to do next.
 */
async function deleteRole(){
    try{
        const result = await pickRole();
        if(result === 'roleMenu' || result === 'mainMenu' || result === 'exit'){
            return Promise.resolve(result);
        }
        const response = await fetch(URL + '/roles/' + result.id, {method: 'DELETE'});
        const [role] = await response.json();
        console.log( "Deleted role: " + role.title);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * pickRole
 * @returns - The role object or next state
 * 
 * Gathers an array of roles from the backend.
 * Formats the selection for inquirer.
 * Asks the user to make a selection.
 */
async function pickRole(){
    try{
        const roles = await getAllRoles();
        const selection = new Array();
        for(let role of roles){
            role = await formatRole(role);
            let name = `${role.department} - ${role.title}`;
            selection.push({
                name: name,
                value: role.id
            });
        }
        selection.push({
            name: "Back",
            value: 'roleMenu'
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
                message: "Pick the role?",
                choices: selection
            }
        ]);
        const task = result.task;
        if(result.task === 'roleMenu' || result.task === 'mainMenu' || result.task === 'exit'){
            return Promise.resolve(task);
        }
        return await getRole(task);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getAllRoles
 * @returns - An array of roles pulled from the backend.
 * 
 * Fetches an array of roles from the backend.
 */
async function getAllRoles(){
    try{
        const response = await fetch(URL + '/roles', { method: 'GET' });
        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getRole
 * @param {INT} id - ID of role
 * @returns - A role object
 * 
 * Fetches a role based on ID from the backend.
 * Pulls the object outside of the response array.
 */
async function getRole(id){
    try{
        const response = await fetch(URL + '/roles/' + id, { method: 'GET' });
        const [role] = await response.json();
        return Promise.resolve(role);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getBody
 * @returns - body object to adjust/create the values of a role
 * 
 * Asks the user for the title.
 * Asks the user for the salary.
 * Asks the user for the department.
 * Creates a body object.
 */
async function getBody(){
    try{
        const title = await getTitle();
        if(title === 'roleMenu' || title === 'mainMenu' || title === 'exit'){
            return Promise.resolve(title);
        }
        const salary = await getSalary();
        if(salary === 'roleMenu' || salary === 'mainMenu' || salary === 'exit'){
            return Promise.resolve(salary);
        }
        const department = await pickDepartment();
        if(department === 'departmentMenu'){
            return Promise.resolve('roleMenu');
        }
        if(department === 'mainMenu' || department === 'exit'){
            return Promise.resolve(department);
        }
        const body = {
            title: title,
            salary: salary,
            department_id: department.id
        };
        return Promise.resolve(body);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * formatRole
 * @param {role} role - role object to be parsed
 * @returns formatted role
 * 
 * Finds the department's name.
 * Replaces department_id for the name of the department.
 * Changes how salary is displayed.
 */
async function formatRole(role){
    try{
        const department = await getDepartment(role.department_id);
        delete role.department_id;
        role.department = department.department_name;
        role.salary = "$ " + parseFloat(role.salary).toLocaleString(
            'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}
            )
        return Promise.resolve(role);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getTitle
 * @returns - The title of the role or the next state
 * 
 * Asks the user to input a title.
 * Checks to see if the input is valid.
 * Repeats the function if it is not.
 */
async function getTitle(){
    try{
        console.log("Enter 'Back' to return to the previous menu.");
        console.log("Enter 'Return' to return to the main menu.");
        console.log("Enter 'Exit' to quit.");
        const result = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 
                    "What's the title of the role?\n" +
                    "** Must be between 3 to 30 characters. **"
            }
        ]);
        const title = result.title;
        const  titleTest = title.toLowerCase().replace(/\s/g, "");
        if(titleTest === 'back'){
            return Promise.resolve('roleMenu');
        }
        if(titleTest === 'return'){
            return Promise.resolve('mainMenu');
        }
        if(titleTest === 'exit'){
            return Promise.resolve('exit');
        }
        if(title.length < 3 || title.length > 30){
            console.log("Didn't enter a title between 3 to 30 characters.")
            return await getTitle();
        }
        return Promise.resolve(title);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getSalary
 * @returns - The salary of the role or the next state
 * 
 * Asks the user to input a salary.
 * Checks to see if the input could be a number.
 * Repeats the function if it is not.
 */
async function getSalary(){
    try{
        console.log("Enter 'Back' to return to the previous menu.");
        console.log("Enter 'Return' to return to the main menu.");
        console.log("Enter 'Exit' to quit.");
        const result = await inquirer.prompt([
            {
                type: 'input',
                name: 'salary',
                message: "What's the salary for the role?"
            }
        ]);
        const salaryTest = result.salary.toLowerCase().replace(/\s/g, "");
        if(salaryTest === 'back'){
            return Promise.resolve('roleMenu');
        }
        if(salaryTest === 'return'){
            return Promise.resolve('mainMenu');
        }
        if(salaryTest === 'exit'){
            return Promise.resolve('exit');
        }
        const salary = parseFloat(result.salary);
        if(isNaN(salary)){
            console.log("Didn't enter a number.")
            return await getSalary();
        }
        return Promise.resolve(salary);
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
                        value: 'roleMenu'
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

module.exports = { displayRoleMenu, viewAllRoles, viewRole, addRole, updateRole, deleteRole, pickRole };