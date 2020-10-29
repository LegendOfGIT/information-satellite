/*
global
console
describe
*/

let consoleMock;

const originalConsole = global.console;

let commandPromise;

describe('get-value-from-array', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/get-value-from-array');

        parameters = parameters || {
            contextId: 'title-image',
            sourceContextId: 'images-big',
            index: 2
        };

        commandPromise = command(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "get-value-from-array"');
                done();
            });
        });

        test('logs a message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('required parameter "contextId" is not given. abort.');
                done();
            });
        });
    });

    describe('command is called without required argument "sourceContextId"', () => {
        beforeEach(() => {
            commandIsCalled({
                contextId: 'abc'
            });
        });

        test('logs a message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith(
                    'required parameter "sourceContextId" is not given. abort.'
                );
                done();
            });
        });
    });

    describe('command is called with required arguments', () => {
        describe('source context data DOES NOT exist', () => {
            beforeEach(() => {
                commandIsCalled({
                    contextId: 'abc',
                    sourceContextId: 'def'
                });
            });

            test('logs a message', (done) => {
                commandPromise.then(() => {
                    expect(consoleMock.log).toHaveBeenCalledWith(
                        'context with source context id "def" does not exist. abort.'
                    );
                    done();
                });
            });
        });

        describe('source context data DOES exist', () => {
            test('getValuesByRegex returns values', (done) => {
                const context = {
                    'images-big': [ 'oh', 'hello', 'mr', 'anderson']
                };
                commandIsCalled(undefined, context);

                commandPromise.then(() => {
                    expect(context['title-image']).toBe('mr');
                    done();
                });
            });
        });
    });
});
