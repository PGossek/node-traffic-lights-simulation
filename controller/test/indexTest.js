'use strict';
const { assert } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').callThru();

class TestContext {
    constructor() {
        this.getMock = sinon.stub();
        this.listenMock = sinon.stub();
        this.appMock = {
            get: this.getMock,
            listen: this.listenMock
        };
    }

    getTarget()
    {
        return proxyquire('../src/index.js', {
            'express': () => {
                return this.appMock;
            },
        });
    }
}

describe('index tests', () => {
    it('should call app functions', () => {
        // GIVEN
        const c = new TestContext();
        // WHEN / THEN
        c.getTarget();
        assert.ok(c.getMock.calledOnce);
        assert.ok(c.listenMock.calledOnce);
    });
});