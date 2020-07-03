'use strict';

const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const choseLight = require('./chooseLight');

const app = express();
const port = 8080;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => res.send('Hello World!'));

let totalWsNumber = 0;
let greenColors = 0;

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(`There is new traffic light with ${message} id`);
        ws.id = message;
    });
    ws.on('close', () => {
        totalWsNumber--;
        if (ws.color === choseLight.colors.GREEN) {
            greenColors--;
        }
        console.log(`WebSocket for ${ws.id}  was closed`);
    });
    totalWsNumber++;
    const color = choseLight.getLightColor('none', totalWsNumber, greenColors);
    ws.color = color;
    ws.send(color);
    if (ws.color === choseLight.colors.GREEN) {
        greenColors++;
    }
    setInterval(() => {
        if (ws.color === choseLight.colors.GREEN) {
            greenColors--;
        }
        const color = choseLight.getLightColor(ws.color, totalWsNumber, greenColors);
        ws.color = color;
        ws.send(color);
        if (ws.color === choseLight.colors.GREEN) {
            greenColors++;
        }
    }, 20000);
});

server.listen(port, function(err) {
    if (err) {
        throw err;
    }
    console.log(`'Example app listening on port ${port}!`);
});
