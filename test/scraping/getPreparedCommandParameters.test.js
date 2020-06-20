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
});
