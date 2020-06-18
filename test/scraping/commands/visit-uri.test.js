/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

let httpClientGetPromise;
const httpClientMock = {
    get: jest.fn(() => httpClientGetPromise)
};
const httpClientJestMock = jest.mock(
    'axios',
    () => httpClientMock
);

let context;
let visitUriPromise;
describe('visit-uri', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const visitUriIsCalled = (parameters, getPromise) => {
        context = {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        httpClientGetPromise = getPromise || Promise.resolve({ data: 'tasty website content' });

        const visitUri = require('../../../src/scraping/commands/visit-uri');

        parameters = parameters || {
            contextId: 'oh-hello',
            uri: 'http://oh.hello.co.uk/oh/hello'
        };

        visitUriPromise = visitUri(context, parameters);
    };

    describe('visitUri is called without arguments', () => {
        beforeEach(() => {
            visitUriIsCalled({});
        });

        test('logs a message', (done) => {
            visitUriPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('required parameter "uri" is not given. abort.');
                done();
            });
        });
    });

    describe('visitUri is called without required argument "contextId"', () => {
        beforeEach(() => {
            visitUriIsCalled({
                uri: 'http://www.ex.ample'
            });
        });

        test('logs a message', (done) => {
            visitUriPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('required parameter "contextId" is not given. abort.');
                done();
            });
        });
    });

    describe('visitUri is called with required parameters', () => {
        beforeEach(() => { visitUriIsCalled(); });

        test('http-client is called with given uri', (done) => {
            visitUriPromise.then(() => {
                expect(httpClientMock.get).toHaveBeenCalledWith('http://oh.hello.co.uk/oh/hello');
                done();
            });
        });

        describe('httpClient rejects requested uri', () => {
            beforeEach(() => { visitUriIsCalled(undefined, Promise.reject()); });

            test('logs a message', (done) => {
                visitUriPromise.then(() => {
                    expect(consoleMock.log).toHaveBeenCalledWith(
                        'requested uri "http://oh.hello.co.uk/oh/hello" can not be resolved. abort'
                    );

                    done();
                });
            });
        });

        describe('httpClient resolves requested uri', () => {
            beforeEach(() => { visitUriIsCalled(undefined); });

            test('logs a message and stores httpClient response in context object', (done) => {
                visitUriPromise.then(() => {
                    expect(consoleMock.log).toHaveBeenCalledWith(
                        'requested uri "http://oh.hello.co.uk/oh/hello" was resolved successfully.'
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
