const scrapingCommandMock = jest.fn();

const scrapingCommandJestMock = jest.mock(
    '../../scraping/commands/scraping-command-a.js',
    () => scrapingCommandMock,
    {
        virtual: true
    }
);

const getScrapingCommandById = require('../../src/scraping/getScrapingCommandById');

describe('getScrapingCommandById', () => {
    describe('the requested command DOES NOT exist', () => {
        test('should not return anything', () => {
            expect(getScrapingCommandById('scraping-command-b')).toEqual(undefined);
        });
    });

    describe('the requested command DOES exist', () => {
        test('should return the requested template', () => {
            expect(getScrapingCommandById('scraping-command-a')).toBe(scrapingCommandMock);
        });
    });
});
