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
        'template.itemId': 'nice-site-123',
        'template.navigationPath': [
            'NA', 'NA_VI', 'NA_VI_GA', 'NA_VI_GA_TION'
        ]
    })
);

const httpClientMock = {
    put: jest.fn()
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
        jest.clearAllMocks();
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const visitUri = require('../../../src/scraping/commands/store-information');

        parameters = parameters || {
            contextId: 'oh-hello',
            informationIds: [
                'link',
                'price',
                'product-description',
                'product-title',
                'title'
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
        describe('information "link" is missing in context', () => {
            beforeEach(() => {
                commandIsCalled(undefined, {
                    price: 123.45,
                    'product-brand': 'siemens',
                    'product-title': 'toaster'
                });
            });

            test('logs a message', (done) => {
                commandPromise.then(() => {
                    expect(consoleMock.log).toHaveBeenCalledWith('required context information "link" is not given. abort.');
                    done();
                });
            });

            test('http-client is not called', (done) => {
                commandPromise.then(() => {
                    expect(httpClientMock.put).not.toHaveBeenCalled();
                    done();
                });
            });
        });
        describe('information "title" is missing in context', () => {
            beforeEach(() => {
                commandIsCalled(undefined, {
                    link: 'http://www.links.de/link',
                    price: 123.45,
                    'product-brand': 'siemens',
                    'product-title': 'toaster'
                });
            });

            test('logs a message', (done) => {
                commandPromise.then(() => {
                    expect(consoleMock.log).toHaveBeenCalledWith('required context information "title" is not given. abort.');
                    done();
                });
            });

            test('http-client is not called', (done) => {
                commandPromise.then(() => {
                    expect(httpClientMock.put).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('context contains required information', () => {
            beforeEach(() => {
                commandIsCalled(undefined, {
                    link: 'http://links.de',
                    price: 123.45,
                    'product-brand': 'siemens',
                    'product-title': 'toaster',
                    title: 'la informacion'
                });
            });

            test('http-client is called with given uri', (done) => {
                commandPromise.then(() => {
                    expect(httpClientMock.put).toHaveBeenCalledWith(
                        'http://127.0.0.1:3002/information-item',
                        {
                            itemId: 'nice-site-123',
                            link: 'http://links.de without irrelevant content',
                            navigationPath: [
                                'NA', 'NA_VI', 'NA_VI_GA', 'NA_VI_GA_TION'
                            ],
                            price: 123.45,
                            'product-title': 'toaster without irrelevant content',
                            title: 'la informacion without irrelevant content'
                        }
                    );
                    done();
                });
            });

            test('the content to store is logged into console', (done) => {
                commandPromise.then(() => {
                    expect(console.log).toHaveBeenCalledWith({
                        itemId: 'nice-site-123',
                        link: 'http://links.de without irrelevant content',
                        navigationPath: [
                            'NA', 'NA_VI', 'NA_VI_GA', 'NA_VI_GA_TION'
                        ],
                        price: 123.45,
                        'product-title': 'toaster without irrelevant content',
                        title: 'la informacion without irrelevant content'
                    });
                    done();
                });
            });
        });
    });
});
