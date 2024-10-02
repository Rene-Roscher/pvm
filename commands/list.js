const { logSuccess, logError } = require('../themes/theme');
const { listVersions, currentLink } = require('../common/utils');
const fs = require('fs');
const path = require('path');

const list = () => {
  const versions = listVersions();

  if (versions.length === 0) {
    logError('No PHP versions installed.');
    return;
  }

  logSuccess('Installed PHP versions:\n');

  let currentVersion = 'None';
  try {
    if (fs.existsSync(currentLink)) {
      const symlinkPath = fs.readlinkSync(currentLink);
      currentVersion = path.basename(path.dirname(path.dirname(symlinkPath)));
    } else {
      logError('No PHP version is currently set.');
    }
  } catch (err) {
    logError('Error reading the current PHP symlink.');
  }

  versions.forEach(version => {
    const displayVersion = version.replace('php-', '');
    const isCurrent = currentVersion.includes(version);
    console.log(`${displayVersion} ${isCurrent ? '(Current)' : ''}`);
  });
};

module.exports = list;
