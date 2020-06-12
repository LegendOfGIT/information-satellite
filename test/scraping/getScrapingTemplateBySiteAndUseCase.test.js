const templateMock = {
    nice: {
        little: "template"
    }
};

const templateJestMock = jest.mock(
    '../../scraping/lets-scrape/single-item.json',
    () => templateMock,
    {
        virtual: true
    }
);

const getScrapingTemplateBySiteAndUseCase = require('../../src/scraping/getScrapingTemplateBySiteAndUseCase');

describe('getScrapingTemplateBySiteAndUseCase', () => {
    describe('the requested template DOES NOT exist', () => {
        test('should not return anything', () => {
            expect(getScrapingTemplateBySiteAndUseCase('not-scraped-yet', 'single-item')).toEqual(undefined);
        });
    });

    describe('the requested template DOES exist', () => {
        test('should return the requested template', () => {
            expect(getScrapingTemplateBySiteAndUseCase('lets-scrape', 'single-item')).toBe(templateMock);
        });
    });
});
