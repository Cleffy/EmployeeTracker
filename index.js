const inquirer = require('inquirer');
const { displayMainMenu } = require('./public/tracker');
const { 
    displayDepartmentMenu, 
    viewAllDepartments, 
    viewDepartmentBudgetSalary, 
    addDepartment, 
    updateDepartment, 
    deleteDepartment } = require('./public/departments');

let running = true;
let state = 0;

console.log(
    '////////////////////\n' +
    '/ Employee Tracker /\n' +
    '////////////////////\n'
);

async function stateControl(){
    switch(state){
        // Main Menu
        case 0:
            state = await displayMainMenu();
            break;
        
        // Department States
        case 1:
            state = await displayDepartmentMenu();
            break;
        case 2:
            state = await viewAllDepartments();
            break;
        case 3:
            state = await viewDepartmentBudgetSalary();
            break;
        case 4:
            state = await addDepartment();
            break;
        case 5:
            state = await updateDepartment();
            break;
        case 6:
            state = await deleteDepartment();
            break;

        case 'exit':
            running = false;
            break;
        default:
            running = false;
            break;
    }
    if(running){
        await stateControl();
    }
}

stateControl();
console.log('Exiting');