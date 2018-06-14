#!/usr/local/bin/node
'use strict';

// Requires
const pjson          = require('../package.json');
const program        = require('commander');
const log = require('./Log');

const { initialiseConnection, instantiateListeners } = require('./Logic')

program
    .version(pjson.version || '0.0.1')
    .description(pjson.description || '')

program
    .command('start')
    .alias('s')
    .description('search for a server to connect to...')
    .action(() => {
        initialiseConnection()
        .then((socket) => {
            // We now have the socket returned to us,
            // we need to start listening for data
            instantiateListeners(socket);
        })
        .catch((err) => {
            log.error(err);
        });
    });

program.parse(process.argv);
