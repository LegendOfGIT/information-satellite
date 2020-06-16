/**
 * global console
 */

const consoleMock = {
    log: jest.fn()
}

const getScrapingCommandByIdMock = jest.fn();
const getScrapingCommandByIdJestMock = jest.mock(
    '../../src/scraping/getScrapingCommandById',
    () => getScrapingCommandByIdMock
);

const applyScrapingTemplate = require('../../src/scraping/applyScrapingTemplate');

const originalConsole = global.console;

describe('applyScrapingTemplate', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.console = consoleMock;
    });

    afterEach(() => {
        global.console = originalConsole;
    });

    describe('applyScrapingTemplate is called without scraping commands', () => {
        test('logs a message', () => {
            applyScrapingTemplate();

            expect(consoleMock.log).toHaveBeenCalledWith('Let us scrape!');
            expect(consoleMock.log).toHaveBeenCalledWith('nothing to scrape. stopping.');
        });
    });

    describe('applyScrapingTemplate is called with scraping commands', () => {
        beforeEach(() => {
            applyScrapingTemplate({
                scraping: [
                    { commandId: 'a' },
                    { commandId: 'b' }
                ]
            });
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

        describe('scraping command HAS NOT been found', () => {
            test('logs a message', () => {
                expect(consoleMock.log).toHaveBeenCalledWith('command "a" is not defined');
                expect(consoleMock.log).toHaveBeenCalledWith('command "b" is not defined');
            });
        });
    });
});
