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

jest.doMock(
    '../../../src/scraping/getPreparedCommandParameters',
    () => () => ({
        'template.itemId': 'nice-site-123'
    })
);


let httpClientPutPromise;
const httpClientMock = {
    put: jest.fn(() => httpClientPutPromise)
};
jest.doMock(
    'axios',
    () => httpClientMock
);

describe('store-information', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const visitUri = require('../../../src/scraping/commands/store-information');

        parameters = parameters || {
            contextId: 'oh-hello',
            informationIds: [
                'price',
                'product-description',
                'product-title'
            ]
        };

        commandPromise = visitUri(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs a startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "store-information"');
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
                    'http://127.0.0.1:3002/information-item',
                    {
                        itemId: 'nice-site-123',
                        price: 123.45,
                        'product-title': 'toaster without irrelevant content'
                    }
                );
                done();
            });
        });

        test('the content to store is logged into console', (done) => {
            commandPromise.then(() => {
                expect(console.log).toHaveBeenCalledWith({
                    itemId: 'nice-site-123',
                    price: 123.45,
                    'product-title': 'toaster without irrelevant content'
                });
                done();
            });
        });
    });
});
