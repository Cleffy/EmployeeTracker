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
 *   >  Back
 *   >  Return to Main Menu
 *   >  Exit
 * >  Back
 * >  Exit
 */

const inquirer = require('inquirer');
require('dotenv').config();
const URL = `http://${process.env.DB_HOST}:${process.env.PORT}`;

async function displayDepartmentMenu(){
    const result = await inquirer.prompt([
        {
            type: 'list',
            name: 'task',
            message: "How would you like to manage the departments?",
            choices: [
                {
                    name: "View all departments",
                    value: "view"
                },
                {
                    name: "See a departments salary budget",
                    value: "budget"
                },
                {
                    name: "Add a department",
                    value: "add"
                },
                {
                    name: "Delete a department",
                    value: "delete"
                },
                {
                    name: "Back",
                    value: "back"
                },
                {
                    name: "Return to Main Menu",
                    value: "return"
                },
                {
                    name: "Exit",
                    value: "exit"
                }
            ]
        }
    ]);
    return Promise.resolve(result.task);
}

async function viewAllDepartments(){
    const departments = await getAllDepartments();
    for(let department of departments){
        console.log(department.department_name);
    }
    return await finishedTask();
}

async function viewDepartmentBudgetSalary(){
    const id = await pickDepartment();
    if(id === 'back' || id === 'return' || id === 'exit'){
        return Promise.resolve(id);
    }
    const response = await fetch(URL + '/departments/budget/' + id, { method: 'GET' });
    return await finishedTask();
}

async function addDepartment(){
    const name = await getName();
    if(name === 'back' || name === 'return' || name === 'exit'){
        return Promise.resolve(name);
    }
    const response = await fetch(URL + '/departments', {
        method: 'POST',
        headers: {
            "Content-Type": "application/JSON"
        },
        body: JSON.stringify(name)
    });
    const [department] = await response.json();
    console.log( "Added department: " + department.department_name);
    return await finishedTask();
}

async function updateDepartment(){
    const id = await pickDepartment();
    if(id === 'back' || id === 'return' || id === 'exit'){
        return Promise.resolve(id);
    }
    const name = await getName();
    if(name === 'back' || name === 'return' || name === 'exit'){
        return Promise.resolve(name);
    }
    const response = await fetch(URL + '/departments/' + id, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/JSON"
        },
        body: JSON.stringify(name)
    });
    const [department] = await response.json();
    console.log( "Updated department: " + department.department_name);
    return await finishedTask();
}

async function pickDepartment(){
    const departments = await getAllDepartments();
    const selection = new Array();
    for(let department of departments){
        selection.push({
            name: department.department_name,
            value: department.id
        });
    }
    selection.push({
        name: "Back",
        value: "back"
    });
    selection.push({
        name: "Return to Main Menu",
        value: "return"
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
    return Promise.resolve(result.task);
}

async function getAllDepartments(){
    const response = await fetch(URL + '/departments', { method: 'GET' });
    return await response.json();
}

async function getName(){
    console.log("Enter 'Back' to return to the previous menu.");
    console.log("Enter 'Return' to return to the main menu.");
    console.log("Enter 'Exit' to quit.");
    const result = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What's the name of the new department?\n" +
            "**Must be between 3 to 30 characters.**"
        }
    ]);
    let name = result.name;
    if(
        name.toLowerCase() === 'back' ||
        name.toLowerCase() === 'return' ||
        name.toLowerCase() === 'exit'
        ){
            return Promise.resolve(name.toLowerCase());
    }
    if(name < 3 || name > 30){
        console.log("Didn't enter a name between 3 to 30 characters.")
        name = await getName();
    }
    return Promise.resolve(name);
}

async function finishedTask(){
    const result = await inquirer.prompt([
        {
            type: 'list',
            name: 'task',
            message: "How would you like to manage the departments?",
            choices: [
                {
                    name: "Back",
                    value: "back"
                },
                {
                    name: "Return to Main Menu",
                    value: "return"
                },
                {
                    name: "Exit",
                    value: "exit"
                }
            ]
        }
    ]);
    return Promise.resolve(result.task);
}