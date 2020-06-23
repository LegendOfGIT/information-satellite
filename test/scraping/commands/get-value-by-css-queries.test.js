/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

let commandPromise;

const elementMock = {
    get: jest.fn(() => [{
        children: [
            { data: '11,11' }
        ]
    }])
};
const cssSelectorMock = jest.fn(() => elementMock);
const cheerioMock = {
    html: jest.fn((content) => `cheerio.html(${content})`),
    load: jest.fn(() => cssSelectorMock)
};
const cheerioJestMock = jest.mock(
    'cheerio',
    () => cheerioMock
);

describe('get-value-by-css-queries', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/get-value-by-css-queries');

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
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "get-value-by-css-queries"');
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

            test('query result is stored in context object', (done) => {
                commandPromise.then(() => {
                    expect(context.price).toBe('11,11');
                    done();
                });
            });
        });
    });
});
