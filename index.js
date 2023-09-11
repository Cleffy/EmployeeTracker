const inquirer = require('inquirer');
const { displayMainMenu } = require('./public/tracker');
const { 
    displayDepartmentMenu, 
    viewAllDepartments, 
    viewDepartmentBudgetSalary, 
    addDepartment, 
    updateDepartment, 
    deleteDepartment } = require('./public/departments');
const { 
    displayRoleMenu, 
    viewAllRoles, 
    viewRole, 
    addRole, 
    updateRole, 
    deleteRole } = require('./public/roles');

let running = true;
let state = 'mainMenu';

console.log(
    '////////////////////\n' +
    '/ Employee Tracker /\n' +
    '////////////////////\n'
);

async function stateControl(){
    switch(state){
        // Main Menu
        case 'mainMenu':
            state = await displayMainMenu();
            break;
        
        // Department States
        case 'departmentMenu':
            state = await displayDepartmentMenu();
            break;
        case 'viewDepartments':
            state = await viewAllDepartments();
            break;
        case 'viewDepartmentSalaryBudget':
            state = await viewDepartmentBudgetSalary();
            break;
        case 'addDepartment':
            state = await addDepartment();
            break;
        case 'updateDepartment':
            state = await updateDepartment();
            break;
        case 'deleteDepartment':
            state = await deleteDepartment();
            break;

        // Role States
        case 'roleMenu':
            state = await displayRoleMenu();
            break;
        case 'viewRoles':
            state = await viewAllRoles();
            break;
        case 'viewRole':
            state = await viewRole();
            break;
        case 'addRole':
            state = await addRole();
            break;
        case 'updateRole':
            state = await updateRole();
            break;
        case 'deleteRole':
            state = await deleteRole();
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