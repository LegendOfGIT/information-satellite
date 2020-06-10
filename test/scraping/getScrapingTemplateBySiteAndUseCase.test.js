
const getScrapingTemplateBySiteAndUseCase = require('../../src/scraping/getScrapingTemplateBySiteAndUseCase');

describe('getScrapingTemplateBySiteAndUseCase', () => {
    test('returns an object', () => {
        expect(getScrapingTemplateBySiteAndUseCase()).toEqual({})
    });
});
