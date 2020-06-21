/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

let context;
let commandPromise;

const cheerioJestMock = jest.mock(
    'cheerio',
    () => ({
        load: jest.fn()
    }
));

describe('visit-link-by-css-query', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters) => {
        context = {};

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

    describe.skip('visitUri is called with required parameters', () => {
        beforeEach(() => { commandIsCalled(); });

        test('http-client is called with given uri', (done) => {
            commandPromise.then(() => {
                expect(httpClientMock.get).toHaveBeenCalledWith(USED_URI_FOR_HTTP_CLIENT_CALL);
                done();
            });
        });

        describe('httpClient rejects requested uri', () => {
            beforeEach(() => { commandIsCalled(undefined, Promise.reject()); });

            test('logs a message', (done) => {
                commandPromise.then(() => {
                    expect(consoleMock.log).toHaveBeenCalledWith(
                        `requested uri "${USED_URI_FOR_HTTP_CLIENT_CALL}" can not be resolved. abort`
                    );

                    done();
                });
            });
        });

        describe('httpClient resolves requested uri', () => {
            beforeEach(() => { commandIsCalled(undefined); });

            test('logs a message and stores httpClient response in context object', (done) => {
                commandPromise.then(() => {
                    expect(consoleMock.log).toHaveBeenCalledWith(
                        `requested uri "${USED_URI_FOR_HTTP_CLIENT_CALL}" was resolved successfully.`
                    );
                    expect(context).toEqual({
                        "oh-hello" : "tasty website content"
                    })

                    done();
                });
            });
        });
    });
});
