const shell = require('shelljs');
const path = require('path');
const { logSuccess, logError } = require('../themes/theme');
const { pvmDir, currentLink } = require("../common/utils");
const fs = require('fs');

const use = (version) => {
  const installPath = path.join(pvmDir, `php-${version}`);

  if (!fs.existsSync(installPath)) {
    logError(`PHP ${version} is not installed.`);
    return;
  }

  shell.exec(`sudo rm -f ${currentLink}`);
  shell.exec(`sudo ln -sf ${path.join(installPath, 'bin/php')} ${currentLink}`);

  logSuccess(`Now using PHP ${version}.`);
};

module.exports = use;
