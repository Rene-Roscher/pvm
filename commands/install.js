const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const { logSuccess, logError } = require('../themes/theme');
const { pvmDir, loadConfig, ensureDirectory } = require('../common/utils');

const install = (version) => {
  const installPath = path.join(pvmDir, `php-${version}`);
  const tarball = `${installPath}/php-${version}.tar.gz`;
  const phpSrcDir = `${installPath}/php-src`;

  if (fs.existsSync(installPath)) {
    logError(`PHP ${version} is already installed.`);
    return;
  }

  ensureDirectory(installPath);
  logSuccess(`Installing PHP ${version}...`);

  const downloadResult = shell.exec(`wget https://www.php.net/distributions/php-${version}.tar.gz -O ${tarball}`);
  if (downloadResult.code !== 0) {
    logError(`Error downloading PHP ${version}.`);
    shell.rm('-rf', installPath);
    return;
  }

  shell.mkdir('-p', phpSrcDir);
  const extractResult = shell.exec(`tar -xvzf ${tarball} -C ${phpSrcDir} --strip-components=1`);
  if (extractResult.code !== 0) {
    logError('Error extracting the PHP tarball.');
    shell.rm('-rf', installPath);
    return;
  }

  const config = loadConfig();
  const phpExtensions = config['default-extensions'];
  shell.cd(phpSrcDir);
  const configureCmd = `./configure --prefix=${installPath} ${phpExtensions.join(' ')}`;
  const configureResult = shell.exec(configureCmd);
  if (configureResult.code !== 0) {
    logError('Error during configuration.');
    shell.rm('-rf', installPath);
    return;
  }

  const makeResult = shell.exec('make -j $(grep -c ^processor /proc/cpuinfo)');
  if (makeResult.code !== 0) {
    logError('Error during compilation.');
    shell.rm('-rf', installPath);
    return;
  }

  const installResult = shell.exec('make install');
  if (installResult.code !== 0) {
    logError('Error during installation.');
    shell.rm('-rf', installPath);
    return;
  }

  shell.rm('-rf', phpSrcDir);
  shell.rm(tarball);
  logSuccess(`PHP ${version} installed successfully in ${installPath}.`);
};

module.exports = install;
