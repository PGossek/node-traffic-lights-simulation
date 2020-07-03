'use strict';
const { assert } = require('chai');

const chooseLight = require('./../src/chooseLight');

describe('choose light tests', () => {
    it('should return GREEN when there is new traffic light and active greens are less than 20%', () => {
        // GIVEN
        const actualColor = 'none';
        const wsCount = 20;
        const greenColorsCount = 3;
        // WHEN
        const choosenColor = chooseLight.getLightColor(actualColor, wsCount, greenColorsCount);
        // THEN
        assert.equal(chooseLight.colors.GREEN, choosenColor);
    });

    it('should return random color when there is new traffic light and active greens are more than 20%', () => {
        // GIVEN
        const actualColor = 'none';
        const wsCount = 20;
        const greenColorsCount = 10;
        // WHEN
        const choosenColor = chooseLight.getLightColor(actualColor, wsCount, greenColorsCount);
        // THEN
        assert.notDeepEqual(actualColor, choosenColor);
    });

    it('should return changed random color when actual is GREEN and active greens are less than 20%', () => {
        // GIVEN
        const actualColor = chooseLight.colors.GREEN;
        const wsCount = 20;
        const greenColorsCount = 3;
        // WHEN
        const choosenColor = chooseLight.getLightColor(actualColor, wsCount, greenColorsCount);
        // THEN
        assert.notDeepEqual(actualColor, choosenColor);
    });

    it('should return changed random color when actual is GREEN and active greens are more than 20%', () => {
        // GIVEN
        const actualColor = chooseLight.colors.GREEN;
        const wsCount = 20;
        const greenColorsCount = 10;
        // WHEN
        const choosenColor = chooseLight.getLightColor(actualColor, wsCount, greenColorsCount);
        // THEN
        assert.notDeepEqual(actualColor, choosenColor);
    });

    it('should return changed random color when active greens are more than 20%', () => {
        // GIVEN
        const actualColor = chooseLight.colors.RED;
        const wsCount = 20;
        const greenColorsCount = 10;
        // WHEN
        const choosenColor = chooseLight.getLightColor(actualColor, wsCount, greenColorsCount);
        // THEN
        assert.notDeepEqual(actualColor, choosenColor);
    });

    it('should return GREEN color when active greens are less than 20%', () => {
        // GIVEN
        const actualColor = chooseLight.colors.RED;
        const wsCount = 20;
        const greenColorsCount = 3;
        // WHEN
        const choosenColor = chooseLight.getLightColor(actualColor, wsCount, greenColorsCount);
        // THEN
        assert.deepEqual(chooseLight.colors.GREEN, choosenColor);
    });
});