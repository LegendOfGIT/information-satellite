/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

let commandPromise;

const cssSelectorMock = jest.fn();
const cheerioMock = {
    html: jest.fn((content) => `cheerio.html(${content})`),
    load: jest.fn(() => cssSelectorMock)
};
const cheerioJestMock = jest.mock(
    'cheerio',
    () => cheerioMock
);

let getValuesFromCssSelectorResponseMock = [];
const getValuesFromCssSelectorResponseJestMock = jest.mock(
    '../../../src/scraping/processing/getValuesFromCssSelectorResponse',
    () => () => getValuesFromCssSelectorResponseMock
);

describe('get-values-by-css-queries', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/get-values-by-css-queries');

        parameters = parameters || {
            contextId: 'price',
            sourceContextId: 'page',
            'css-queries': [
                '#oh',
                '#hello'
            ]
        };

        commandPromise = command(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "get-values-by-css-queries"');
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

    describe('command is called without required argument "css-queries"', () => {
        beforeEach(() => {
            commandIsCalled({
                contextId: 'abc',
                sourceContextId: 'page'
            });
        });

        test('logs a message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith(
                    'required parameter "css-queries" is not given. abort.'
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
            const context = {
                page: 'ghi'
            };

            beforeEach(() => {
                commandIsCalled(undefined, context);
            });

            test('cheerio.load is called with value from source context', (done) => {
                commandPromise.then(() => {
                    expect(cheerioMock.load).toHaveBeenCalledWith('ghi');
                    done();
                });
            });

            test('loaded cheerio is called with given css queries', (done) => {
                commandPromise.then(() => {
                    expect(cssSelectorMock).toHaveBeenCalledWith('#oh');
                    done();
                });
            });
        });

        const getValuesFromCssSelectorResponseTestProvider = [
            {
                scenarioName: 'no values from css selector response',
                valuesFromCssSelectorResponse: [],
                expectedContent: undefined
            },
            {
                scenarioName: 'multiple values from css selector response',
                valuesFromCssSelectorResponse: ['abc', undefined, 'def'],
                expectedContent: ['abc', 'def']
            }
        ];

        getValuesFromCssSelectorResponseTestProvider.forEach(item => {
            const context = {
                page: 'ghi'
            };

            beforeEach(() => {
                getValuesFromCssSelectorResponseMock = item.valuesFromCssSelectorResponse;
                commandIsCalled(item.parameters, context);
            });

            describe('CSS selection returns a specific result-set', () => {
                test(`query result is stored in context object (${item.scenarioName})`, (done) => {
                    commandPromise.then(() => {
                        expect(context.price).toEqual(item.expectedContent);
                        done();
                    });
                });
            });
        });
    });
});
