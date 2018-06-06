'use strict';

// Requires
const pjson     = require('../package.json');
const program   = require('commander');

// Other Constants
const port      = process.env.PORT || 4001;

program
    .version(pjson.version || '0.0.1')
    .description(pjson.description || '')

program
    .command('start')
    .alias('s')
    .description('search for a server to connect to...')
    .action(() => {
        console.log('test');
        // TODO:
        // 1. connect to the WSS
        // 2. expect welcome, present user with options for watchers to tail
        // 3. (opt.) request historic data if required
        // 4. start outputting intercepted data
    });

program.parse(process.argv);
