'use strict';

const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const choseLight = require('./chooseLight');
const vueHelpersFunctions = require('./vueHelpersFunctions');
const DbDao = require('./db/DbDao');
const ColorTable = require('./db/ColorTable');
const TrafficLightTable = require('./db/TrafficLightTable');
const LastColorTable = require('./db/LastColorTable');
const dbOperation = require('./db/dbOperation');

const dao = new DbDao();
const colorTable = new ColorTable(dao);
const trafficLightTable = new TrafficLightTable(dao);
const lastColorTable = new LastColorTable(dao);

const app = express();
const port = 8080;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

let totalWsNumber = 0;
let greenColors = 0;

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        if(message === 'VueWantsData') {
            ws.send(JSON.stringify(vueHelpersFunctions.collectDataForVue(wss)));
        }
        else {
            console.log(`There is new traffic light with ${message} id`);
            ws.id = message;
            totalWsNumber++;
            trafficLightTable.insert(ws.id);
            const color = choseLight.getLightColor('none', totalWsNumber, greenColors);
            ws.color = color;
            ws.send(color);
            lastColorTable.insert(ws.id, ws.color);
            if (ws.color === choseLight.colors.GREEN) {
                greenColors++;
            }
            vueHelpersFunctions.sendDataToVue(wss, ws, [{id: ws.id, color: ws.color}]);
            setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    if (ws.color === choseLight.colors.GREEN) {
                        greenColors--;
                    }
                    const color = choseLight.getLightColor(ws.color, totalWsNumber, greenColors);
                    ws.color = color;
                    ws.send(color);
                    lastColorTable.update(ws.id, ws.color);
                    if (ws.color === choseLight.colors.GREEN) {
                        greenColors++;
                    }
                    vueHelpersFunctions.sendDataToVue(wss, ws, [{id: ws.id, color: ws.color}]);
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
        vueHelpersFunctions.sendDataToVue(wss, ws,[{id: ws.id, color: 'Connection closed'}]);
        totalWsNumber--;
        ws.terminate();
    });
});

server.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log(`'Example app listening on port ${port}!`);
    dbOperation.prepareColorTable(colorTable);
    dbOperation.prepareTrafficLightTable(trafficLightTable);
    dbOperation.prepareLastColorTable(lastColorTable);

    // Comment section below to not checking database content on console log
    setInterval(() => {
        console.log('Show database content interval started');
        dbOperation.showLastColorTable(lastColorTable);
        dbOperation.showTrafficLightTable(trafficLightTable);
    }, 40000);
});
