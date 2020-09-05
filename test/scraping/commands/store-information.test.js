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
