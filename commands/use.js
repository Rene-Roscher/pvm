const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const { logSuccess, logError } = require('../themes/theme');

const phpDir = path.join(process.env.HOME, 'php-versions');
const currentLink = '/usr/local/bin/php'; // Link to the currently used PHP version

function use(version) {
  const installPath = path.join(phpDir, `php-${version}`);

  if (!fs.existsSync(installPath)) {
    logError(`PHP ${version} is not installed.`);
    return;
  }

  // Remove existing symlink and create a new one
  shell.exec(`sudo rm -f ${currentLink}`);
  shell.exec(`sudo ln -sf ${path.join(installPath, 'bin/php')} ${currentLink}`);

  logSuccess(`Now using PHP ${version}.`);
}

module.exports = use;
