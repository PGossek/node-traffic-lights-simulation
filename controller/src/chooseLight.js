'use strict';

const colors = {
    RED: 'Red',
    REDYELLOW: 'Red-yellow',
    YELLOW: 'Yellow',
    GREEN: 'Green'
};

function getLightColor(actualColor, wsCount, greenColorsCount) {
    if (actualColor !== colors.GREEN && greenColorsCount*100/wsCount < 20) {
        return colors.GREEN;
    }
    let newCollor;
    while(!newCollor || newCollor === actualColor){
        newCollor = colors[Object.keys(colors)[Math.floor(Math.random() * Object.keys(colors).length)]];
    }
    return newCollor;
}

module.exports = {
    colors,
    getLightColor
};
