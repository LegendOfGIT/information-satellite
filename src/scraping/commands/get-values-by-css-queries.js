const cheerio = require('cheerio');
const getValuesFromCssSelectorResponse = require('../processing/getValuesFromCssSelectorResponse');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-values-by-css-queries"')

    const { contextId, mustContain, mustNotContain, sourceContextId } = parameters;
    const cssQueries = parameters['css-queries'];

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
    }

    if (!cssQueries) {
        console.log('required parameter "css-queries" is not given. abort.');
        resolve();
    }

    const sourceContext = Object.call(context, sourceContextId) ? context[sourceContextId] : '';
    if (!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
    }

    const attributeId = parameters['attribute-id'] || '';

    const cssSelector = cheerio.load(sourceContext);
    cssQueries.forEach(cssQuery => {
        if(context[contextId]) {
            return;
        }

        const valuesFromCssSelector = getValuesFromCssSelectorResponse(
            cssSelector(cssQuery),
            attributeId,
            mustContain,
            mustNotContain
        );
        const values = valuesFromCssSelector.filter(item => item);
        context[contextId] = 0 === values.length ? undefined : values;
    });

    resolve();
});
