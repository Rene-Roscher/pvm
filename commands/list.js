const fs = require('fs');
const path = require('path');
const { logSuccess, logError } = require('../themes/theme');

const phpDir = path.join(process.env.HOME, 'php-versions');
const currentLink = '/usr/local/bin/php'; // Path to the symlink for the current PHP version

function list() {
  if (!fs.existsSync(phpDir)) {
    logError('No PHP versions installed.');
    return;
  }

  const versions = fs.readdirSync(phpDir).filter(dir => dir.startsWith('php-'));

  if (versions.length === 0) {
    logError('No PHP versions installed.');
  } else {
    logSuccess('Installed PHP versions:\n');

    // Determine the current PHP version in use
    let currentVersion = 'None';

    try {
      if (fs.existsSync(currentLink)) {
        const symlinkPath = fs.readlinkSync(currentLink); // Read the symlink target

        // Extract the parent directory of the symlink target
        currentVersion = path.basename(path.dirname(path.dirname(symlinkPath))); // Navigate up from `bin/php` to get the version
      } else {
        logError('No PHP version is currently set.');
      }
    } catch (err) {
      logError('Error reading the current PHP symlink.');
      console.error(err); // Output the error for debugging
    }

    // List installed versions and highlight the current one
    versions.forEach(version => {
      const displayVersion = version.replace('php-', '');
      const isCurrent = currentVersion.includes(version);
      console.log(`${displayVersion} ${isCurrent ? '(Current)' : ''}`);
    });
  }
}

module.exports = list;
