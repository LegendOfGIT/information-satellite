const getValueWithoutIrrelevantContent = require('../../src/scraping/getValueWithoutIrrelevantContent');
describe('getValueWithoutIrrelevantContent', () => {
    const testProvider = [
        {},
        {
            value: 12,
            expectedValue: 12
        },
        {
            value: 'a\tb',
            expectedValue: 'ab'
        },
        {
            value: 'a\tb\r\nc',
            expectedValue: 'abc'
        },
        {
            value: ' d\te\r\nf  ',
            expectedValue: 'def'
        },
    ];

    testProvider.forEach(item => {
        test(`call with "${item.value}" returns "${item.expectedValue}"`, () => {
            expect(getValueWithoutIrrelevantContent(item.value)).toBe(item.expectedValue);
        });
    });
});
