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
    const result = await inquirer.prompt([
        {
            type: 'list',
            name: 'task',
            message: "How would you like to manage in departments?",
            choices: [
                {
                    name: "View all departments",
                    value: 2
                },
                {
                    name: "See a departments salary budget",
                    value: 3
                },
                {
                    name: "Add a department",
                    value: 4
                },
                {
                    name: "Update a department",
                    value: 5
                },
                {
                    name: "Delete a department",
                    value: 6
                },
                {
                    name: "Back",
                    value: 0
                },
                {
                    name: "Return to Main Menu",
                    value: 0
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

/**
 * viewAllDepartments
 * @returns - Next state
 * 
 * Displays all the departments
 * Asks the user what they want to do next.
 */
async function viewAllDepartments(){
    const departments = await getAllDepartments();
    for(let department of departments){
        console.log(department.department_name);
    }
    return await finishedTask();
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
    const result = await pickDepartment();
    if(result === 1 || result === 0 || result === 'exit'){
        return Promise.resolve(result);
    }

    const response = await fetch(URL + '/departments/budget/' + result.id, { method: 'GET' });
    const [data] = await response.json();
    console.log(
        'Total Salary Budget: $ ' + 
        parseFloat(data.total_salary).toLocaleString(
            'en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}
            )
        );
    return await finishedTask();
}

/**
 * addDepartment
 * @returns - Next state
 * 
 * Asks the user to pick a name.
 * Adds the department to the database.
 * Asks the user what they want to do next.
 */
async function addDepartment(){
    const name = await getName();
    if(name === 1 || name === 0 || name === 'exit'){
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

/**
 * updateDepartment
 * @returns - Next state
 * 
 * Asks the user to pick a department.
 * Asks the user to pick a name.
 * Updates the department in the databse.
 * Asks the user what they want to do next.
 */
async function updateDepartment(){
    const result = await pickDepartment();
    if(result === 1 || result === 0 || result === 'exit'){
        return Promise.resolve(department);
    }
    const name = await getName();
    if(name === 1 || name === 0 || name === 'exit'){
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

/**
 * deleteDepartment
 * @returns - Next state
 * 
 * Asks the user to pick a department.
 * Deletes the department in the databse.
 * Asks the user what they want to do next.
 */
async function deleteDepartment(){
    const result = await pickDepartment();
    if(result === 1 || result === 0 || result === 'exit'){
        return Promise.resolve(result);
    }

    const response = await fetch(URL + '/departments/' + result.id, {
        method: 'DELETE'
    });
    const [department] = await response.json();
    console.log( "Deleted department: " + department.department_name);
    return await finishedTask();
}

/**
 * pickDepartment
 * @returns - The department object or next state
 * 
 * Gathers an array of departments from the backend.
 * Formats the selection for inquirer.
 * Queries the user to make a selection.
 */
async function pickDepartment(){
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
        value: 'back'
    });
    selection.push({
        name: "Return to Main Menu",
        value: 'return'
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
    if(result.task === 'back'){
        return Promise.resolve(1);
    }
    if(result.task === 'return'){
        return Promise.resolve(0);
    }
    if(result.task === 'exit'){
        return Promise.resolve(id);
    }

    const response = await fetch(URL + '/departments/' + result.task, { method: 'GET' });
    const [department] = await response.json();
    return department;
}

/**
 * getAllDepartments
 * @returns - An array of departments pulled from the backend.
 * 
 * Fetches an array of departments from the backend.
 */
async function getAllDepartments(){
    const response = await fetch(URL + '/departments', { method: 'GET' });
    return await response.json();
}

/**
 * getName
 * @returns - The name of the department or next state
 * 
 * Queries the user to input a name.
 * Checks to see if the input is valid.
 * Reruns the function if it is not.
 */
async function getName(){
    console.log("Enter 'Back' to return to the previous menu.");
    console.log("Enter 'Return' to return to the main menu.");
    console.log("Enter 'Exit' to quit.");
    const result = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 
                "What's the name of the new department?\n" +
                "** Must be between 3 to 30 characters. **"
        }
    ]);
    let name = result.name;
    let nameTest = name.toLowerCase().replace(/\s/g, "");
    if(nameTest === 'back'){
        return Promise.resolve(1);
    }
    if(nameTest === 'return'){
        return Promise.resolve(0);
    }
    if(nameTest === 'exit'){
        return Promise.resolve(nameTest);
    }
    if(name.length < 3 || name.length > 30){
        console.log("Didn't enter a name between 3 to 30 characters.")
        return await getName();
    }
    return Promise.resolve(name);
}

/**
 * finishedTask
 * @returns - The next state
 * 
 * Queries the user which menu they want to navigate to next.
 */
async function finishedTask(){
    const result = await inquirer.prompt([
        {
            type: 'list',
            name: 'task',
            message: "How would you like to manage the departments?",
            choices: [
                {
                    name: "Back",
                    value: 1
                },
                {
                    name: "Return to Main Menu",
                    value: 0
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

module.exports = { displayDepartmentMenu, viewAllDepartments, viewDepartmentBudgetSalary, addDepartment, updateDepartment, deleteDepartment };