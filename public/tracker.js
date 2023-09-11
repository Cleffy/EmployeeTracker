const inquirer = require('inquirer');

/**
 * displayMainMenu
 * @returns - Next state
 * 
 * Asks the user what they would like to do in departments.
 */
async function displayMainMenu(){
    const result = await inquirer.prompt([
        {
            type: 'list',
            name: 'task',
            message: "What would you like to manage?",
            choices: [
                {
                    name: "Manage departments",
                    value: 'departmentMenu'
                },
                {
                    name: "Manage roles",
                    value: 'roleMenu'
                },
                {
                    name: "Manage employees",
                    value: 'employeeMenu'
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

module.exports = { displayMainMenu }