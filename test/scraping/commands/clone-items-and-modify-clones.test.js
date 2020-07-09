/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

let commandPromise;

describe('clone-items-and-modify-clones', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/clone-items-and-modify-clones');

        parameters = parameters || {
            contextId: 'items-with-clones',
            sourceContextId: 'items'
        };

        commandPromise = command(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "clone-items-and-modify-clones"');
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

    const testProvider = [
        {
            scenarioName: 'just cloning',
            items: [
                'oh', 'hi', 'Mark','!'
            ],
            expectedItems: [
                'oh', 'hi', 'Mark','!'
            ]
        },
        {
            scenarioName: 'cloning and replacing',
            parameters: {
                contextId: 'items-with-clones',
                sourceContextId: 'items',
                replacements: {
                    "oh": "",
                    "Mark": "Greg",
                    "!": "?!?"
                }
            },
            items: [
                'oh hi Mark !',
                'bye Mark ...',
                'Happy !!!',
            ],
            expectedItems: [
                ' hi Greg ?!?',
                'bye Greg ...',
                'Happy ?!??!??!?'
            ]
        }
    ];

    testProvider.forEach(item => {
        test(item.scenarioName, () => {
            const context = {
                items: item.items
            };
            commandIsCalled(item.parameters, context);

            expect(context['items-with-clones']).toEqual(item.expectedItems);
        });
    });
});
