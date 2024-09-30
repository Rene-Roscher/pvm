const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const { logSuccess, logError } = require('../themes/theme');

const phpDir = path.join(process.env.HOME, 'php-versions');

function install(version) {
  const installPath = path.join(phpDir, `php-${version}`);
  const tarball = `${installPath}/php-${version}.tar.gz`;
  const phpSrcDir = `${installPath}/php-src`;

  // Cleanup function to remove the installation directory if something goes wrong
  function cleanup() {
    logError(`Cleaning up partially installed PHP version ${version}...`);
    shell.rm('-rf', installPath); // Remove the entire directory
  }

  if (fs.existsSync(installPath)) {
    logError(`PHP ${version} is already installed.`);
    return;
  }

  shell.mkdir('-p', installPath);
  logSuccess(`Installing PHP ${version}...`);

  // Step 1: Download the PHP source code
  const downloadResult = shell.exec(`wget https://www.php.net/distributions/php-${version}.tar.gz -O ${tarball}`);
  if (downloadResult.code !== 0) {
    logError(`Error downloading PHP ${version}.`);
    cleanup();
    return;
  }

  // Step 2: Extract the source code
  shell.mkdir('-p', phpSrcDir);
  const extractResult = shell.exec(`tar -xvzf ${tarball} -C ${phpSrcDir} --strip-components=1`);
  if (extractResult.code !== 0) {
    logError('Error extracting the PHP tarball.');
    cleanup();
    return;
  }

  // Step 3: Configure the build with the custom installation path
  shell.cd(phpSrcDir);
  const configureCmd = `./configure --prefix=${installPath} --enable-mbstring --enable-intl --with-openssl --with-curl --with-zlib --with-pdo-mysql --with-sqlite3 --with-pdo-sqlite`;
  const configureResult = shell.exec(configureCmd);

  if (configureResult.code !== 0) {
    logError('Error during configuration.');
    cleanup();
    return;
  }

  // Step 4: Compile and install PHP
  const makeResult = shell.exec('make -j4'); // "-j4" to use 4 cores for faster compilation
  if (makeResult.code !== 0) {
    logError('Error during compilation.');
    cleanup();
    return;
  }

  const installResult = shell.exec('make install');
  if (installResult.code !== 0) {
    logError('Error during installation.');
    cleanup();
    return;
  }

  // Step 5: Clean up tarball and source directory after successful installation
  shell.rm('-rf', phpSrcDir);
  shell.rm(tarball);

  logSuccess(`PHP ${version} installed successfully in ${installPath}.`);
}

module.exports = install;
