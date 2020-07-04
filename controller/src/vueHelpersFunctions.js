'use strict';

const WebSocket = require('ws');

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

module.exports = {
    sendDataToVue,
    collectDataForVue
};
