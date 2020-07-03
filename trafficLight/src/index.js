'use strict';

const WebSocket = require('ws');
const _ = require('underscore');

let id = process.argv[2];

if (_.isUndefined(id)) {
    const uuid = require('uuid');
    id = uuid.v4();
}

console.log(`I'm new traffic light, my id is: ${id}`);

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
    ws.send(id);
});

const lights = ['Red', 'Red-yellow', 'Yellow', 'Green'];

ws.on('message', function incoming(data) {
    if(lights.includes(data)) {
        console.log(`Controller told me to light on ${data}`);
    }
    else {
        console.log(`Controller told me to light on ${data}, but I don't have such collor, so I'm going to blink yellow`);
    }
});
