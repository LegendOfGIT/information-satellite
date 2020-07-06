/**
 * global console
 */

const getValuesFromCssSelectorResponse = require('../../../src/scraping/processing/getValuesFromCssSelectorResponse');

describe('getValuesFromCssSelectorResponse', () => {
    const testProvider = [
        {
            scenarioName: 'no parameters given',
            expectedResult: []
        },
        {
            scenarioName: 'single query hit without specialties',
            cssSelectorResponse: {
                get: () => [
                    {
                        children: [
                            {
                                type: 'text',
                                data: ' abc '
                            }
                        ]
                    }
                ]
            },
            expectedResult: [ 'abc' ]
        },
        {
            scenarioName: 'multiple query hit with specialties',
            cssSelectorResponse: {
                get: () => [
                    {
                        children: [
                            {
                                type: 'text',
                                data: ' abc '
                            },
                            {
                                type: 'tag',
                                data: '<div>'
                            },
                            {
                                type: 'text',
                                data: ' de fgh '
                            }
                        ]
                    },
                    {
                        children: [
                            {
                                type: 'text',
                                data: ' 123 456 '
                            }
                        ]
                    },
                ]
            },
            expectedResult: [ 'abc  de fgh', '123 456' ]
        },
        {
            scenarioName: 'single hit with given attributeId',
            attributeId: 'test',
            cssSelectorResponse: {
                get: () => [
                    {
                        attribs: {
                            test: '  it '
                        }
                    }
                ]
            },
            expectedResult: [ 'it' ]
        },
        {
            scenarioName: 'multiple hit with given attributeId',
            attributeId: 'test',
            cssSelectorResponse: {
                get: () => [
                    {
                        attribs: {
                            test: '  it '
                        }
                    },
                    {
                        attribs: {
                            test: '  654 321   '
                        }
                    }
                ]
            },
            expectedResult: [ 'it', '654 321' ]
        }
    ];

    testProvider.forEach(item => {
        test(item.scenarioName, () => {
            expect(
                getValuesFromCssSelectorResponse(item.cssSelectorResponse, item.attributeId)
            ).toEqual(item.expectedResult);
        });
    });
});
