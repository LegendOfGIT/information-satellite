/**
 * global console
 */

let consoleMock;

const originalConsole = global.console;

let commandPromise;

describe('get-value-by-regex', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const commandIsCalled = (parameters, context) => {
        context = context || {};

        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const command = require('../../../src/scraping/commands/get-value-by-regex');

        parameters = parameters || {
            contextId: 'price',
            sourceContextId: 'page',
            'regex': 'b.*e'
        };

        commandPromise = command(context, parameters);
    };

    describe('command is called without arguments', () => {
        beforeEach(() => {
            commandIsCalled({});
        });

        test('logs startup message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith('executing command "get-value-by-regex"');
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

    describe('command is called without required argument "regex"', () => {
        beforeEach(() => {
            commandIsCalled({
                contextId: 'abc',
                sourceContextId: 'page'
            });
        });

        test('logs a message', (done) => {
            commandPromise.then(() => {
                expect(consoleMock.log).toHaveBeenCalledWith(
                    'required parameter "regex" is not given. abort.'
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
            const regexTestProvider = [
                {
                    scenarioName: 'no match',
                    regex: 'xy.*z',
                    expectedContent: undefined
                },
                {
                    scenarioName: 'match without group',
                    regex: 'd.*f',
                    expectedContent: 'def'
                },
                {
                    scenarioName: 'match with group',
                    regex: '(ab)(.*)(c)(.*)(f)',
                    groupIndex: 4,
                    expectedContent: 'de'
                },
                {
                    scenarioName: 'match with non existing group',
                    regex: '(ab)(.*)(c)(.*)(f)',
                    groupIndex: 10,
                    expectedContent: undefined
                },
                {
                    scenarioName: 'multiple matches',
                    regex: '/(ab)(.*)(c)(.*)(f)/g',
                    groupIndex: 1,
                    expectedContent: undefined
                }
            ];

            regexTestProvider.forEach(({ expectedContent, groupIndex, regex, scenarioName }) => {
                describe(scenarioName, () => {
                    let context = {
                        page: 'abcdefabcdefabcdef'
                    };

                    beforeEach(() => {
                        context = {
                            page: 'abcdef'
                        };

                        commandIsCalled({
                            contextId: 'price',
                            sourceContextId: 'page',
                            regex,
                            groupIndex
                        }, context);
                    });

                    test('command returns expected value', (done) => {
                        commandPromise.then(() => {
                            expect(context.price).toBe(expectedContent);
                            done();
                        });
                    });
                });
            });
        });
    });
});
