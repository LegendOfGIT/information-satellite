/*
global
console
describe
*/

let consoleMock;

const originalConsole = global.console;

let commandPromise;

let getValuesByRegexResponseMock = [];
const getValuesByRegexMock = jest.fn(() => getValuesByRegexResponseMock);
const abc = jest.mock(
    '../../../src/scraping/processing/getValuesByRegex',
    () => getValuesByRegexMock
);

describe('get-values-by-regex', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/get-values-by-regex');

        parameters = parameters || {
            contextId: 'price',
            sourceContextId: 'page',
            'regex': 'b.*e',
            groupIndex: 3
        };

        commandPromise = command(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "get-values-by-regex"');
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

    describe('command is called without required argument "regex"', () => {
        beforeEach(() => {
            commandIsCalled({
                contextId: 'abc',
                sourceContextId: 'page'
            });
        });

        test('logs a message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith(
                    'required parameter "regex" is not given. abort.'
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
            let context;

            beforeEach(() => {
                context = {
                    page: 'def'
                };
            });

            test('getValuesByRegex is called with expected arguments', (done) => {
                commandIsCalled(undefined, context);
                commandPromise.then(() => {
                    expect(getValuesByRegexMock).toHaveBeenCalledWith('def', 'b.*e', 3);
                    done();
                });
            })

            test('getValuesByRegex returns no values', (done) => {
                getValuesByRegexResponseMock = [];
                commandIsCalled(undefined, context);
                commandPromise.then(() => {
                    expect(context.price).toEqual([]);
                    done();
                });
            });

            test('getValuesByRegex returns values', (done) => {
                getValuesByRegexResponseMock = ['oh', 'hello'];
                commandIsCalled(undefined, context);
                commandPromise.then(() => {
                    expect(context.price).toEqual(['oh', 'hello']);
                    done();
                });
            });
        });
    });
});
