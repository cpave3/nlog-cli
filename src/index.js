'use strict';

// Requires
const pjson          = require('../package.json');
const program        = require('commander');
const { initialiseConnection } = require('./Logic')

// Other Constants

program
    .version(pjson.version || '0.0.1')
    .description(pjson.description || '')

program
    .command('start')
    .alias('s')
    .description('search for a server to connect to...')
    .action(() => {
        // TODO:
        // 1. connect to the WSS
        initialiseConnection()
        .then((socket) => {
            // We now have the socket returned to us,
            // we need to start listening for newLine data
        })
        .catch((err) => {
            console.log(err);
        });
        // 2. expect welcome, present user with options for watchers to tail
        // 3. (opt.) request historic data if required
        // 4. start outputting intercepted data
    });

program.parse(process.argv);
