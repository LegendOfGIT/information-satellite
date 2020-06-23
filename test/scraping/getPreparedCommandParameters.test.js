const getPreparedCommandParameters = require('../../src/scraping/getPreparedCommandParameters');

describe('getPreparedCommandParameters', () => {
    describe('nothing has to be replaced', () => {
        test('returns parameters without changes', () => {
            expect(getPreparedCommandParameters({
                a: 'b',
                c: 'd',
                e: 'f'
            })).toEqual({
                a: 'b',
                c: 'd',
                e: 'f'
            });
        });
    });

    describe('values in parameters have to be replaced', () => {
         test('returns with values which replacers were applied', () => {
             expect(getPreparedCommandParameters({
                 stays: 'the same',
                 takes: 'from {stays} and {takesFrom}!',
                 takesFrom: 'all from {stays}'
             })).toEqual({
                 stays: 'the same',
                 takes: 'from the same and all from {stays}!',
                 takesFrom: 'all from the same'
             });
         });
    });

    describe('parameter "uri" does not contain http://', () => {
        test('parameter "uri" will be prepended with {template.site}', () => {
            expect(getPreparedCommandParameters({
                uri: '/my-http-is-missing',
                'template.site': 'mysite.to'
            })).toEqual({
                uri: 'https://mysite.to/my-http-is-missing',
                'template.site': 'mysite.to'
            });
        });
    });

    describe('parameter "uri" does contain http://', () => {
        test('parameter "uri" will be prepended with {template.site}', () => {
            expect(getPreparedCommandParameters({
                uri: 'http://yoursite.to/my-http-is-not-missing',
                'template.site': 'mysite.to'
            })).toEqual({
                uri: 'http://yoursite.to/my-http-is-not-missing',
                'template.site': 'mysite.to'
            });
        });
    });
});
