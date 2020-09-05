/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

let commandPromise;

jest.mock('../../../src/scraping/getValueWithoutIrrelevantContent', () => (value) => {
     if ('string' !== typeof value) {
         return value;
     }

     return `${value} without irrelevant content`;
});

let httpClientPutPromise;
const httpClientMock = {
    put: jest.fn(() => httpClientPutPromise)
};
jest.doMock(
    'axios',
    () => httpClientMock
);

describe('observe-information', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context, putPromise) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const visitUri = require('../../../src/scraping/commands/observe-information');

        parameters = parameters || {
            contextId: 'oh-hello',
            informationIds: [
                'price',
                'product-description',
                'product-title'
            ]
        };

        httpClientPutPromise = putPromise || Promise.resolve({ data: 'tasty website content' });

        commandPromise = visitUri(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs a startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "observe-information"');
                done();
            });
        });

        test('logs a message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('required parameter "informationIds" is not given. abort.');
                done();
            });
        });
    });

    describe('command is called with required parameters', () => {
        beforeEach(() => {
            commandIsCalled(undefined, {
                price: 123.45,
                'product-brand': 'siemens',
                'product-title': 'toaster'
            });
        });

        test('http-client is called with given uri', (done) => {
            commandPromise.then(() => {
                expect(httpClientMock.put).toHaveBeenCalledWith(
                    'http://127.0.0.1:3001/observable-items',
                    {
                        price: 123.45,
                        'product-title': 'toaster without irrelevant content'
                    }
                );
                done();
            });
        });

        test('the content to observe is logged into console', (done) => {
            commandPromise.then(() => {
                expect(console.log).toHaveBeenCalledWith({
                    price: 123.45,
                    'product-title': 'toaster without irrelevant content'
                });

                expect(console.log).toHaveBeenCalledWith('information successfully sent to observation');
                done();
            });
        });
    });
});
