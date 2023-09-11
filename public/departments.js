/**
 * Departments Menu
 * >  View all Departments
 * -- List all departments
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * >  See a departments salary budget
 *  [>] Pick a department
 *     -- Show total salary budget
 *     >  Back
 *     >  Return to Main Menu
 *     >  Exit
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * >  Add a department
 *   [] Input Name / Exit / Back / Main Menu
 *   -- Return to Departments Menu
 * >  Update a department
 *  [>] Pick a department
 *     [] Input Name / Exit / Back / Main Menu
 *     -- Return to Departments Menu
 * >  Delete a department
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * >  Back
 * >  Exit
 */

const inquirer = require('inquirer');
require('dotenv').config();
const URL = `http://${process.env.DB_HOST}:${process.env.PORT}`;

/**
 * displayDepartmentMenu
 * @returns - Next state
 * 
 * Asks the user what they would like to do in departments.
 */
async function displayDepartmentMenu(){
    try{
        const result = await inquirer.prompt([
            {
                type: 'list',
                name: 'task',
                message: "What would you like to manage in departments?",
                choices: [
                    {
                        name: "View all departments",
                        value: 'viewDepartments'
                    },
                    {
                        name: "See a departments salary budget",
                        value: 'viewDepartmentSalaryBudget'
                    },
                    {
                        name: "Add a department",
                        value: 'addDepartment'
                    },
                    {
                        name: "Update a department",
                        value: 'updateDepartment'
                    },
                    {
                        name: "Delete a department",
                        value: 'deleteDepartment'
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
 * viewAllDepartments
 * @returns - Next state
 * 
 * Displays all the departments
 * Asks the user what they want to do next.
 */
async function viewAllDepartments(){
    try{
        const departments = await getAllDepartments();
        console.table(departments);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * viewDepartmentBudgetSalary
 * @returns - Next state
 * 
 * Asks the user to pick a department.
 * Displays the Department's salary budget.
 * Asks the user what they want to do next.
 */
async function viewDepartmentBudgetSalary(){
    try{
        const department = await pickDepartment();
        if(department === 'departmentMenu' || department === 'mainMenu' || department === 'exit'){
            return Promise.resolve(department);
        }

        const response = await fetch(URL + '/departments/budget/' + department.id, { method: 'GET' });
        const [data] = await response.json();
        console.log(
            'Total Salary Budget: $ ' + 
            parseFloat(data.total_salary).toLocaleString(
                'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}
                )
            );
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * addDepartment
 * @returns - Next state
 * 
 * Asks the user to pick a name.
 * Adds the department to the backend.
 * Asks the user what they want to do next.
 */
async function addDepartment(){
    try{
        const name = await getName();
        if(name === 'departmentMenu' || name === 'mainMenu' || name === 'exit'){
            return Promise.resolve(name);
        }

        const response = await fetch(URL + '/departments', {
            method: 'POST',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify({name: name})
        });
        const [department] = await response.json();
        console.log( "Added department: " + department.department_name);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * updateDepartment
 * @returns - Next state
 * 
 * Asks the user to pick a department.
 * Asks the user to pick a name.
 * Updates the department in the backend.
 * Asks the user what they want to do next.
 */
async function updateDepartment(){
    try{
        const result = await pickDepartment();
        if(result === 'departmentMenu' || result === 'mainMenu' || result === 'exit'){
            return Promise.resolve(result);
        }
        const name = await getName();
        if(name === 'departmentMenu' || name === 'mainMenu' || name === 'exit'){
            return Promise.resolve(name);
        }

        const response = await fetch(URL + '/departments/' + result.id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/JSON"
            },
            body: JSON.stringify({name: name})
        });
        const [department] = await response.json();
        console.log( "Updated department: " + department.department_name);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * deleteDepartment
 * @returns - Next state
 * 
 * Asks the user to pick a department.
 * Deletes the department in the backend.
 * Asks the user what they want to do next.
 */
async function deleteDepartment(){
    try{
        const result = await pickDepartment();
        if(result === 'departmentMenu' || result === 'mainMenu' || result === 'exit'){
            return Promise.resolve(result);
        }
        const response = await fetch(URL + '/departments/' + result.id, {method: 'DELETE'});
        const [department] = await response.json();
        console.log( "Deleted department: " + department.department_name);
        return await finishedTask();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * pickDepartment
 * @returns - The department object or next state
 * 
 * Gathers an array of departments from the backend.
 * Formats the selection for inquirer.
 * Asks the user to make a selection.
 */
async function pickDepartment(){
    try{
        const departments = await getAllDepartments();
        const selection = new Array();
        for(const department of departments){
            selection.push({
                name: department.department_name,
                value: department.id
            });
        }
        selection.push({
            name: "Back",
            value: 'departmentMenu'
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
                message: "Pick the department?",
                choices: selection
            }
        ]);
        const task = result.task;
        if(task === 'departmentMenu' || task === 'mainMenu' || task === 'exit'){
            return Promise.resolve(task);
        }
        return await getDepartment(task);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getAllDepartments
 * @returns - An array of departments pulled from the backend.
 * 
 * Fetches an array of departments from the backend.
 */
async function getAllDepartments(){
    try{
        const response = await fetch(URL + '/departments', { method: 'GET' });
        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getDepartment
 * @param {INT} id - ID of department
 * @returns - A department object
 * 
 * Fetches a department based on ID from the backend.
 * Pulls the object outside of the response array.
 */
async function getDepartment(id){
    try{
        const response = await fetch(URL + '/departments/' + id, { method: 'GET' });
        const [department] = await response.json();
        return Promise.resolve(department);
    }
    catch(error){
        console.error(error);
    }
}

/**
 * getName
 * @returns - The name of the department or the next state
 * 
 * Asks the user to input a name.
 * Checks to see if the input is valid.
 * Repeats the function if it is not.
 */
async function getName(){
    try{
        console.log("Enter 'Back' to return to the previous menu.");
        console.log("Enter 'Return' to return to the main menu.");
        console.log("Enter 'Exit' to quit.");
        const result = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 
                    "What's the name of the department?\n" +
                    "** Must be between 3 to 30 characters. **"
            }
        ]);
        let name = result.name;
        let nameTest = name.toLowerCase().replace(/\s/g, "");
        if(nameTest === 'back'){
            return Promise.resolve('departmentMenu');
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
                        value: 'departmentMenu'
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

module.exports = { displayDepartmentMenu, viewAllDepartments, viewDepartmentBudgetSalary, addDepartment, updateDepartment, deleteDepartment, pickDepartment, getDepartment };