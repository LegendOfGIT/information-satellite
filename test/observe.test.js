
let templateMock;
const getScrapingTemplateBySiteAndUseCaseMock = jest.fn(() => templateMock);
jest.doMock(
    '../src/scraping/getScrapingTemplateBySiteAndUseCase',
    () => getScrapingTemplateBySiteAndUseCaseMock
);

const applyScrapingTemplateMock = jest.fn();
jest.doMock(
    '../src/scraping/applyScrapingTemplate',
    () => applyScrapingTemplateMock
);

const observe = require('../src/observe');

describe('observe', () => {
    test('calls getScrapingTemplateBySiteAndUseCase with expected arguments', () => {
        observe(
            'abc',
            'item-overview'
        );

        expect(getScrapingTemplateBySiteAndUseCaseMock).toHaveBeenCalledWith(
            'abc',
            'item-overview'
        );
    });

    describe('site and use-case DOES NOT match to any template', () => {
        test('returns an error', () => {
            expect(observe('abc', 'item-overview')).toEqual({
                error: 'NO_TEMPLATE_FOUND'
            })
        });
    });

    describe('site and use-case DOES match to a template', () => {
        beforeEach(() => {
            templateMock = {
                oh: 'hello!'
            }
        });

        test('returns no error', () => {
            expect(observe(
                'abc',
                'item-overview',
                '08154711',
                [ 'NAVI', 'NAVI_GA', 'NAVI_GA_TION' ]
            )).toEqual({
                error: ''
            });
        });

        test('calls applyScrapingTemplate with expected parameters', () => {
            expect(applyScrapingTemplateMock).toHaveBeenCalledWith(
                templateMock,
                '08154711',
                [ 'NAVI', 'NAVI_GA', 'NAVI_GA_TION' ]
            );
        });
    });
});
