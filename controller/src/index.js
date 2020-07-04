'use strict';

const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const choseLight = require('./chooseLight');

const app = express();
const port = 8080;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

let totalWsNumber = 0;
let greenColors = 0;

function sendDataToVue(wss, ws, data) {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN && client.id === undefined) {
            client.send(JSON.stringify(data));
        }
    });
}

function collectDataForVue(wss) {
    const dataMapArray = [];
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.id !== undefined) {
            dataMapArray.push({id: client.id, color: client.color});
        }
    });
    return dataMapArray;
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        if(message === 'VueWantsData') {
            ws.send(JSON.stringify(collectDataForVue(wss)));
        }
        else {
            console.log(`There is new traffic light with ${message} id`);
            ws.id = message;
            totalWsNumber++;
            const color = choseLight.getLightColor('none', totalWsNumber, greenColors);
            ws.color = color;
            ws.send(color);
            if (ws.color === choseLight.colors.GREEN) {
                greenColors++;
            }
            sendDataToVue(wss, ws, [{id: ws.id, color: ws.color}]);
            setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    if (ws.color === choseLight.colors.GREEN) {
                        greenColors--;
                    }
                    const color = choseLight.getLightColor(ws.color, totalWsNumber, greenColors);
                    ws.color = color;
                    ws.send(color);
                    if (ws.color === choseLight.colors.GREEN) {
                        greenColors++;
                    }
                    sendDataToVue(wss, ws, [{id: ws.id, color: ws.color}]);
                }
            }, 20000);
        }
    });
    ws.on('close', () => {
        if (ws.color === choseLight.colors.GREEN) {
            greenColors--;
        }
        console.log(`WebSocket for ${ws.id}  was closed`);
        if (ws.id === undefined) {
            ws.terminate();
            return;
        }
        sendDataToVue(wss, ws,[{id: ws.id, color: 'Connection closed'}]);
        totalWsNumber--;
        ws.terminate();
    });
});

server.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`'Example app listening on port ${port}!`);
});
