'use strict';

// Package requirements
const io = require('socket.io-client');
const moment         = require('moment');
const inquirer       = require('inquirer');

const port = process.env.PORT || 4001;

// Method declarations
const methods = {
    initialiseConnection: () => {
        // Try to connect to the WSS
        return new Promise((resolve, reject) => {
            // First we need to ask which host we are connecting to, with the default being ourselves
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'host',
                    message: 'Please enter your nlog server\'s hostname or IP address',
                    default: 'localhost'
                },
                {
                    type: 'input',
                    name: 'port',
                    message: 'Please enter your nlog server\'s port',
                    default: process.env.PORT || 4001
                }
            ])
            .then((answers) => {
                // We should have a hostname or IP:port now, and we need to try to connect to it's WSS
                return io.connect('http://localhost:4001', { reconnect: true });
            })
            .then((socket) => {
                // We should now have a socket connection, and need to do something with it
                socket.on('welcome', (data) => {
                    inquirer.prompt([{
                        type: 'checkbox',
                        name: 'watchers',
                        message: 'Select which watchers to subscribe to',
                        choices: data.map((row) => {return {name: row.name, value: row.uuid}})
                    }])
                    .then((selectedWatchers) => {
                        // The user has given a decision on which watchers to subscribe to, tell the server
                        socket.emit('subscribe', selectedWatchers);
                    })
                    .then(() => {
                        socket.on('newLine', (data) => {
                            console.log(data);
                        });
                    });
                });
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
};

module.exports = methods;