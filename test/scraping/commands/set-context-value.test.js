/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

const getPreparedCommandParametersJestMock = jest.mock(
    '../../../src/scraping/getPreparedCommandParameters',
    () => () => ({
        value: 'my sweet prepared value'
    }));

let context;
let commandPromise;

describe('set-context-value', () => {
    let context;

    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters) => {
        context = {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/set-context-value');

        parameters = parameters || {
            contextId: 'ohHello',
            value: 'nice value :)'
        };

        commandPromise = command(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs a startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "set-context-value"');
                done();
            });
        });

        test('logs a message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('required parameter "value" is not given. abort.');
                done();
            });
        });
    });

    describe('command is called without required argument "contextId"', () => {
        beforeEach(() => {
            commandIsCalled({
                value: 'Noice val! :)'
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

        test('getPreparedCommandParameters is called with expected arguments', (done) => {
            commandPromise.then(() => {
                expect(context.ohHello).toBe('my sweet prepared value');
                done();
            });
        });
    });
});
