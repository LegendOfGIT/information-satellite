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
        });

        const cssSelectResponseTestProvider = [
            {
                scenarioName: 'no found children elements',
                cssSelectorResponse: { children: [] },
                expectedContent: ''
            },
            {
                scenarioName: 'normal text only',
                cssSelectorResponse: {
                    children: [
                        {
                            type: 'text',
                            data: '123 '
                        },
                        {
                            type: 'text',
                            data: '456'
                        }
                    ]
                },
                expectedContent: '123 456'
            },
            {
                scenarioName: 'control characters, different types',
                cssSelectorResponse: {
                    children:[
                        {
                            type: 'text',
                            data: '\r\n '
                        },
                        {
                            type: 'element',
                            data: '<div>'
                        },
                        {
                            type: 'text',
                            data: '456 \n'
                        }
                    ]
                },
                expectedContent: '456 \n'
            },
            {
                scenarioName: 'value from attribute',
                parameters: {
                    contextId: 'price',
                    sourceContextId: 'page',
                    'attribute-id': 'abc',
                    'css-queries': [
                        '#oh',
                        '#hello'
                    ]
                },
                cssSelectorResponse: {
                    attribs: {
                        abc: 'cde \n'
                    },
                    children:[]
                },
                expectedContent: 'cde \n'
            }
        ];

        cssSelectResponseTestProvider.forEach(item => {
            const context = {
                page: 'ghi'
            };

            beforeEach(() => {
                elementMock.get = jest.fn(() => [item.cssSelectorResponse]);
                commandIsCalled(item.parameters, context);
            });

            describe('CSS selection returns a specific result-set', () => {
                test(`query result is stored in context object (${item.scenarioName})`, (done) => {
                    commandPromise.then(() => {
                        expect(context.price).toBe(item.expectedContent);
                        done();
                    });
                });
            });
        });
    });
});
