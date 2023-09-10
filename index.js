const inquirer = require('inquirer');
require('dotenv').config();
const URL = `http://${process.env.DB_HOST}:${process.env.PORT}`;

console.log(
    '////////////////////\n' +
    '/ Employee Tracker /\n' +
    '////////////////////\n'
);

let exit = false;
async function sequencer(){
    try{
        let table = await getTask();
        console.log(table);
        if(table.task == "department"){
            await manageDepartment();
        }
    }
    catch(error){
        console.error(error);
    }
}

async function getTask(){
    return await inquirer.prompt([
        {
            type: 'list',
            name: 'task',
            message: "What would you like to manage?",
            choices: [
                {
                    name: "Manage departments",
                    value: "department"
                },
                {
                    name: "Manage roles",
                    value: "role"
                },
                {
                    name: "Manage employees",
                    value: "employee"
                },
                {
                    name: "Exit",
                    value: "exit"
                }
            ]
        }
    ]);
}
async function manageDepartment(){
    let department = await selectDepartmentTask();
    if(department.task == "view"){
        let allDepartments = await getAllDepartments();
        console.log(await allDepartments.json());
    }
    if(department.task == "add"){
        await addDepartment();
    }
}
async function selectDepartmentTask(){
    return await inquirer.prompt([
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
                    name: "Exit",
                    value: "exit"
                }
            ]
        }
    ]);
}
async function getAllDepartments(){
    return await fetch(URL + '/departments', {method: 'GET'});
}
async function addDepartment(){
    let newDepartment = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What's the name of the new department?\n" +
            "**Must be atleast 3 and less than 30 characters.**\n" +
            "**Enter 'Back' to return to the previous menu and 'Exit' to end the program**)"
        }
    ]);
    let department_name = newDepartment.name;
    if(department_name.toLowerCase() == 'exit'){
        exit = true;
    }
    else if(department_name.toLowerCase() == 'back'){
        await manageDepartment();
    }
    else if(department_name.length < 3  || department_name.length > 30){
        await addDepartment();
    }
    else{
        fetch(URL + `/departments/${department_name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

}
sequencer();