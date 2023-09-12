/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

let commandPromise;

describe('get-float-from-value', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/get-float-from-value');

        parameters = parameters || {
            contextId: 'parsed-price',
            sourceContextId: 'price'
        };

        commandPromise = command(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "get-float-from-value"');
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

    const floatParsingTestProvider = [
        { value: '' },
        { value: ' ' },
        { value: 'abc' },
        {
            value: 'abc 1 de',
            expectedFloatValue: 1.0
        },
        {
            value: '3211',
            expectedFloatValue: 3211.0
        },
        {
            value: '211.12',
            expectedFloatValue: 211.12
        },
        {
            value: '4,211.12',
            expectedFloatValue: 4211.12
        },
        {
            value: '123,456',
            expectedFloatValue: 123.456
        },
        {
            value: '2.123,456',
            expectedFloatValue: 2123.456
        },
        {
            value: ',45',
            expectedFloatValue: 0.45
        },
        {
            value: '.99',
            expectedFloatValue: 0.99
        },
        {
            value: '1.099',
            expectedFloatValue: 1099.00
        }
    ];
    floatParsingTestProvider.forEach(item => {
        describe(`float is parsed correctly and stored in context (value: ${item.value})`, () => {
            const context = {
                "price": item.value
            };
            commandIsCalled(undefined, context);
            expect(context['parsed-price']).toBe(item.expectedFloatValue);
        });
    });
});
