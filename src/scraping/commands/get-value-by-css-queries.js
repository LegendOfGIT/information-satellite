const cheerio = require('cheerio');
const getValuesFromCssSelectorResponse = require('../processing/getValuesFromCssSelectorResponse');
const getPreparedCommandParameters = require("../getPreparedCommandParameters");

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-value-by-css-queries"')

    const commandParameters = getPreparedCommandParameters(Object.assign(
        {},
        parameters,
        context
    ));

    const { contextId, mustContain, sourceContextId, separator = undefined, unique = false } = commandParameters;
    const cssQueries = commandParameters['css-queries'];

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
        return;
    }

    if (Object.prototype.hasOwnProperty.call(context, contextId) && context[contextId] !== `{${contextId}}`) {
        resolve();
        return;
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
        return;
    }

    if (!cssQueries) {
        console.log('required parameter "css-queries" is not given. abort.');
        resolve();
        return;
    }

    const sourceContext = Object.call(context, sourceContextId) ? context[sourceContextId] : '';
    if (!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
        return;
    }

    const attributeId = commandParameters['attribute-id'] || '';

    const cssSelector = cheerio.load(sourceContext);
    cssQueries.forEach(cssQuery => {
        if(context[contextId] && context[contextId] !== `{${contextId}}`) {
            return;
        }

        let valuesFromCssSelector = getValuesFromCssSelectorResponse(
            cssSelector(cssQuery),
            attributeId,
            mustContain
        );

        if (unique) {
            valuesFromCssSelector = valuesFromCssSelector.filter((value, index, array) => array.indexOf(value) === index);
        }

        context[contextId] =
            0 === valuesFromCssSelector.length
                ? undefined
                : undefined !== separator
                    ? valuesFromCssSelector.join(separator)
                    : valuesFromCssSelector[0];
    });

    resolve();
});
