const chalk = require('chalk');

function logSuccess(message) {
  console.log(chalk.green(message));
}

function logError(message) {
  console.log(chalk.red(message));
}

module.exports = {
  logSuccess,
  logError
};
