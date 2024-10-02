const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
const { logSuccess, logError } = require('../themes/theme');

const pvmDir = path.join(process.env.HOME, '.pvm');
const configFile = path.join(pvmDir, 'config.json');
const currentLink = '/usr/local/bin/php'; // Symlink for the current PHP version

const defaultConfig = {
    "default-extensions": [
        '--enable-mbstring',
        '--enable-intl',
        '--with-openssl',
        '--with-curl',
        '--with-zlib',
        '--with-zip',
        '--with-pdo-mysql',
        '--with-sqlite3',
        '--with-pdo-sqlite',
        '--enable-gd',
        '--enable-sockets',
        '--enable-bcmath',
        '--enable-opcache',
        '--enable-pcntl'
    ]
};

/**
 * Ensures the directory exists, creates it if necessary.
 */
const ensureDirectory = (dir) => {
    if (!fs.existsSync(dir)) {
        shell.mkdir('-p', dir);
    }
};

/**
 * Creates the config file with default values if it doesn't exist.
 */
const createConfigFileIfNotExists = () => {
    if (!fs.existsSync(configFile)) {
        try {
            ensureDirectory(pvmDir);
            fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2), 'utf8');
            logSuccess(`Created ${configFile} with default configuration.`);
        } catch (error) {
            logError(`Error creating ${configFile}: ${error.message}`);
        }
    } else {
        logSuccess(`Config file ${configFile} already exists.`);
    }
};

/**
 * Loads configuration from the config file.
 */
const loadConfig = () => {
    createConfigFileIfNotExists();
    try {
        const jsonData = fs.readFileSync(configFile, 'utf8');
        const config = JSON.parse(jsonData);
        logSuccess('Configuration loaded from config.json.');
        return config;
    } catch (error) {
        logError('Error reading or parsing config.json, using default configuration.');
        return defaultConfig;
    }
};

/**
 * Lists all installed PHP versions.
 */
const listVersions = () => {
    if (!fs.existsSync(pvmDir)) {
        logError('No PHP versions installed.');
        return [];
    }
    return fs.readdirSync(pvmDir).filter(dir => dir.startsWith('php-'));
};

module.exports = {
    pvmDir,
    configFile,
    currentLink,
    ensureDirectory,
    createConfigFileIfNotExists,
    loadConfig,
    listVersions,
    defaultConfig
};
