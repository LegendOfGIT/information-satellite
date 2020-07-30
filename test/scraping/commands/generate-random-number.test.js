/*
 * global
 * console
 */

let consoleMock;

const originalConsole = global.console;

let commandPromise;

const originalMath = global.Math;

describe('generate random number', () => {
    let context;

    beforeEach(() => {
        global.Math = {
            floor: originalMath.floor,
            random: () => 0.123
        };
    });

    afterEach(() => {
        global.console = originalConsole;
        global.Math = originalMath;
    });

    const commandIsCalled = (parameters) => {
        context = {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/generate-random-number');

        parameters = parameters || {
            contextId: 'ohHello',
            maximum: 123
        };

        commandPromise = command(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs a startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "generate-random-number"');
                done();
            });
        });

        test('logs a message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('required parameter "maximum" is not given. abort.');
                done();
            });
        });
    });

    describe('command is called without required argument "contextId"', () => {
        beforeEach(() => {
            commandIsCalled({
                maximum: 321
            });
        });

        test('logs a message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('required parameter "contextId" is not given. abort.');
                done();
            });
        });
    });

    describe('command is called with required parameters', () => {
        beforeEach(() => { commandIsCalled(); });

        test('expected random number is stored in context', (done) => {
            commandPromise.then(() => {
                expect(context.ohHello).toBe(16);
                done();
            });
        });
    });
});
