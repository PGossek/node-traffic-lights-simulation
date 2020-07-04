'use strict';

const Promise = require('bluebird');

const colors = require('../chooseLight').colors;

function prepareColorTable(colorTable) {
    colorTable.createTable()
        .then(() => colorTable.truncateTable())
        .then(() => colorTable.removeIndex())
        .then(() => colorTable.insert(colors.RED))
        .then(() => colorTable.insert(colors.REDYELLOW))
        .then(() => colorTable.insert(colors.YELLOW))
        .then(() => colorTable.insert(colors.GREEN))
        .then(() => colorTable.getAll())
        .then((colors) => {
            console.log('\nRetrieved inserted colors from database');
            return new Promise(() => {
                colors.forEach((color) => {
                    console.log(`color id = ${color.id}`);
                    console.log(`color name = ${color.color_name}`);
                });
            });
        })
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
        });
}

function prepareTrafficLightTable(trafficLightTable) {
    trafficLightTable.createTable()
        .then(() => trafficLightTable.truncateTable())
        .then(() => trafficLightTable.removeIndex())
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
        });
}

function prepareLastColorTable(lastColorTable) {
    lastColorTable.createTable()
        .then(() => lastColorTable.truncateTable())
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
        });
}

function showTrafficLightTable(trafficLightTable) {
    trafficLightTable.getAll()
        .then((trafficLights) => {
            console.log('\nRetrieved inserted trafficLights from database');
            return new Promise(() => {
                trafficLights.forEach((trafficLight) => {
                    console.log(`trafficLight id = ${trafficLight.id}`);
                    console.log(`trafficLight name = ${trafficLight.unique_name}`);
                });
            });
        })
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
        });
}

function showLastColorTable(lastColorTable) {
    lastColorTable.getAll()
        .then((lastColors) => {
            console.log('\nRetrieved inserted lastColors from database');
            return new Promise(() => {
                lastColors.forEach((lastColor) => {
                    console.log(`lastColor unique_name_id = ${lastColor.unique_name_id}`);
                    console.log(`lastColor name = ${lastColor.color_name_id}`);
                });
            });
        })
        .catch((err) => {
            console.log('Error: ');
            console.log(JSON.stringify(err));
        });
}

module.exports = {
    prepareColorTable,
    prepareTrafficLightTable,
    prepareLastColorTable,
    showTrafficLightTable,
    showLastColorTable
};
