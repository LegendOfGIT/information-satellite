/**
 * global console
 */

const getValuesByRegex = require('../../../src/scraping/processing/getValuesByRegex');

describe('getValuesByRegex', () => {
    const testProvider = [
        {
            scenarioName: 'no parameters given',
            expectedResult: []
        },
        {
            scenarioName: 'only sourceContext given',
            sourceContext: 'abcdef abcdef abcdef',
            expectedResult: []
        },
        {
            scenarioName: 'simple regex given (no hit)',
            sourceContext: 'abcdef abcdef abcdef hij',
            regex: 'xyz',
            expectedResult: []
        },
        {
            scenarioName: 'simple regex given (single hit)',
            sourceContext: 'abcdef abcdef abcdef hij',
            regex: 'hi',
            expectedResult: [ 'hi' ]
        },
        {
            scenarioName: 'simple regex given (multiple hits)',
            sourceContext: 'abcdef abcdef abcdef hij',
            regex: 'abc',
            expectedResult: [ 'abc', 'abc', 'abc' ]
        },
        {
            scenarioName: 'complex regex given (no hit)',
            sourceContext: 'abcdef abcdef abcdef hij',
            regex: 'xy(cd)z',
            groupIndex: 1,
            expectedResult: []
        },
        {
            scenarioName: 'complex regex given (invalid group)',
            sourceContext: 'abcdef abcdef abcdef hij',
            regex: 'ac(cd)e',
            groupIndex: 3,
            expectedResult: []
        },
        {
            scenarioName: 'complex regex given (single hit)',
            sourceContext: 'abcdef abcdef abcdef hij',
            regex: 'abc.*?(abc).*?(hi)j',
            groupIndex: 2,
            expectedResult: [ 'hi' ]
        },
        {
            scenarioName: 'complex regex given (multiple hits)',
            sourceContext: 'abc abcdefabc abcdef abcdef hij',
            regex: 'abc.*?(abc).*?',
            groupIndex: 1,
            expectedResult: [ 'abc', 'abc' ]
        }
    ];

    testProvider.forEach(({ expectedResult,groupIndex, regex , scenarioName, sourceContext }) => {
        test(scenarioName, () => {
            expect(
                getValuesByRegex(sourceContext, regex, groupIndex)
            ).toEqual(expectedResult);
        });
    });
});
