/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

let commandPromise;

const elementMock = {
    attr: jest.fn(() => 'http://i.found-a-link.org')
};
const cssSelectorMock = jest.fn(() => elementMock);
const cheerioMock = {
    load: jest.fn(() => cssSelectorMock)
};
const cheerioJestMock = jest.mock(
    'cheerio',
    () => cheerioMock
);

const visitUriCommandPromise = Promise.resolve();
const visitUriCommandMock = jest.fn(() => visitUriCommandPromise);
const visitUriCommandJestMock = jest.mock(
    '../../../src/scraping/commands/visit-uri',
    () => visitUriCommandMock
);

describe('visit-link-by-css-query', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/visit-link-by-css-query');

        parameters = parameters || {
            contextId: 'oh-hello',
            sourceContextId: 'the-source',
            'css-query': '#oh .hello'
        };

        commandPromise = command(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "visit-link-by-css-query"');
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
            const context = {
                def: 'ghi'
            };

            beforeEach(() => {
                commandIsCalled(
                    {
                        contextId: 'abc',
                        sourceContextId: 'def',
                        'css-query': '#oh .my.god'
                    },
                    context
                );
            });

            test('cheerio.load is called with value from source context', (done) => {
                visitUriCommandPromise.then(() => {
                    expect(cheerioMock.load).toHaveBeenCalledWith('ghi');
                    done();
                });
            });

            test('loaded cheerio is called with given css query', (done) => {
                visitUriCommandPromise.then(() => {
                    expect(cssSelectorMock).toHaveBeenCalledWith('#oh .my.god');
                    done();
                });
            });

            test('css query result is called with attribute expected attribute', (done) => {
                visitUriCommandPromise.then(() => {
                    expect(elementMock.attr).toHaveBeenCalledWith('href');
                    done();
                });
            });

            test('visit-uri command is called with found link', (done) => {
                visitUriCommandPromise.then(() => {
                    expect(visitUriCommandMock).toHaveBeenCalledWith(
                        context,
                        {
                            contextId: 'abc',
                            uri: 'http://i.found-a-link.org'
                        }
                    );
                    done();
                });
            });
        });
    });
});
