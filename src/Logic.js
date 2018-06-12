'use strict';

// Package requirements
const io       = require('socket.io-client');
const moment   = require('moment');
const inquirer = require('inquirer');
const log      = require('./Log');

let availableWatchers = [];
let chosenWatchers;

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
                return io.connect(`http://${answers.host}:${answers.port}`, { reconnect: true });
            })
            .then((socket) => {
                // We should now have a socket connection, and need to do something with it
                // We are going to send the socket back out of the promise for the main process 
                // to do something with
                resolve(socket);
            })
            .catch((err) => {
                reject(err);
            })
        });
    },
    subscribe: (socket, watchers) => {
        socket.emit('subscribe', watchers);
        socket.on('newLine', (data) => {
            // We got data, so let's display it nicely
            log.json(data.record);
        });
    },
    instantiateListeners: (socket) => {
        socket.on('welcome', (data) => {
            // Remember the listed watchers for later usage
            availableWatchers = data;
            // Get some more details from the client
    
            if (!chosenWatchers) {
                inquirer.prompt([{
                    type: 'checkbox',
                    name: 'watchers',
                    message: 'Select which watchers to subscribe to',
                    choices: data.map((row) => {return {name: row.name, value: row.uuid}})
                }])
                .then((selectedWatchers) => {
                    chosenWatchers = selectedWatchers;
                    // The user has given a decision on which watchers to subscribe to, tell the server
                    methods.subscribe(socket, chosenWatchers);
                })
            } else {
                methods.subscribe(socket, chosenWatchers);
            }
        });
        socket.on('disconnect', () => {log.danger('Connection Lost')});
        socket.on('connect', () => {log.success('Connection Established');});
    }
};

module.exports = methods;