/**
 * global console
 */

let consoleMock;

const scrapingCommandMock = jest.fn();
const getScrapingCommandByIdMock = jest.fn((commandId) => {
    if ('c' === commandId) {
        return scrapingCommandMock;
    }

    return undefined;
});
const getScrapingCommandByIdJestMock = jest.mock(
    '../../src/scraping/getScrapingCommandById',
    () => getScrapingCommandByIdMock
);

const originalConsole = global.console;

describe('applyScrapingTemplate', () => {
    afterEach(() => {
        global.console = originalConsole;
    });

    const whenApplyScrapingTemplateIsCalled = (scrapingTemplate) => {
        consoleMock = {
            log: jest.fn()
        };
        global.console = consoleMock;

        const applyScrapingTemplate = require('../../src/scraping/applyScrapingTemplate');

        scrapingTemplate = scrapingTemplate || {
            scraping: [
                { commandId: 'a' },
                { commandId: 'b' }
            ]
        };

        applyScrapingTemplate(scrapingTemplate);
    };

    describe('applyScrapingTemplate is called without scraping commands', () => {
        beforeEach(() => {
            whenApplyScrapingTemplateIsCalled({});
        });

        test('logs a message', () => {
            expect(consoleMock.log).toHaveBeenCalledWith('Let us scrape!');
            expect(consoleMock.log).toHaveBeenCalledWith('nothing to scrape. stopping.');
        });
    });

    describe('applyScrapingTemplate is called with scraping commands', () => {
        beforeEach(() => {
            whenApplyScrapingTemplateIsCalled();
        });

        test('logs a message for each executed command', () => {
            expect(consoleMock.log).toHaveBeenCalledWith('Let us scrape!');
            expect(consoleMock.log).toHaveBeenCalledWith('apply scraping command "a"');
            expect(consoleMock.log).toHaveBeenCalledWith('apply scraping command "b"');
        });

        test('calls getScrapingCommandById with expected arguments', () => {
            expect(getScrapingCommandByIdMock).toHaveBeenCalledWith('a');
            expect(getScrapingCommandByIdMock).toHaveBeenCalledWith('b');
        });
    });

    describe('scraping command HAS NOT been found', () => {
        beforeEach(() => {
            whenApplyScrapingTemplateIsCalled();
        });

        test('logs a message', () => {
            expect(consoleMock.log).toHaveBeenCalledWith('command "a" is not defined');
            expect(consoleMock.log).toHaveBeenCalledWith('command "b" is not defined');
        });
    });

    describe('the second scraping command HAS been found', () => {
        beforeEach(() => {
            whenApplyScrapingTemplateIsCalled({
                scraping: [
                    { commandId: 'a' },
                    {
                        commandId: 'c',
                        parameters: {
                           pa: 'ra',
                           me: 'ters'
                        }
                    },
                    { commandId: 'd' }
                ]
            });
        });

        test('logs a message', () => {
            expect(consoleMock.log).toHaveBeenCalledWith('command "a" is not defined');
            expect(consoleMock.log).toHaveBeenCalledWith('execute command "c"');
            expect(consoleMock.log).toHaveBeenCalledWith('command "d" is not defined');
        });

        test('the found command is called with parameters from template', () => {
            expect(scrapingCommandMock).toHaveBeenCalledWith(
                {},
                {
                    pa: 'ra',
                    me: 'ters'
                }
            );
        });
    });
});
