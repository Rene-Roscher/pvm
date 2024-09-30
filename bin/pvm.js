#!/usr/bin/env node
const {Command} = require('commander');
const program = new Command();
const install = require('../commands/install');
const use = require('../commands/use');
const list = require('../commands/list');

program
    .name('pvm')
    .description('PHP Version Manager for Linux')
    .version('1.0.0');

program
    .command('install <version>')
    .description('Install a specific PHP version')
    .action((version) => {
        install(version);
    });

program
    .command('use <version>')
    .description('Switch to a specific PHP version')
    .action((version) => {
        use(version);
    });

program
    .command('list')
    .description('List installed PHP versions')
    .action(() => {
        list();
    });

program.parse(process.argv);
