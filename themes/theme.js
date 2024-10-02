const chalk = require('chalk');

module.exports = {
  logSuccess: (message) => {
    console.log(chalk.green(message));
  },
  logError: (message) => {
    console.log(chalk.red(message));
  }
};
