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
                    value: 1
                },
                {
                    name: "Manage roles",
                    value: 0
                },
                {
                    name: "Manage employees",
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

module.exports = { displayMainMenu }