/**
 * global console
 */

const consoleMock = {
    log: jest.fn()
}
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
                    { command: 'a' },
                    { command: 'b' }
                ]
            });
        });

        test('logs a message for each executed command', () => {
            expect(consoleMock.log).toHaveBeenCalledWith('Let us scrape!');
            expect(consoleMock.log).toHaveBeenCalledWith('apply scraping command "a"');
            expect(consoleMock.log).toHaveBeenCalledWith('apply scraping command "b"');
        });
    });
});
