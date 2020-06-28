const cheerio = require('cheerio');
const visitUriCommand = require('./visit-uri');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-float-from-value"')

    const { contextId, sourceContextId } = parameters;

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
    }

    const sourceContext = Object.call(context, sourceContextId) ? context[sourceContextId] : '';

    if (!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
    }

    const isLastSeparator = (value, currentIndex) => {
        const restOfValue = value.substring(value.length, currentIndex + 1);

        return -1 === restOfValue.indexOf('.') && -1 === restOfValue.indexOf(',');
    };
    const isNumeric = (value) => /^\d+$/.test(value);
    const isSeparator = (value) => '.' === value || ',' === value;

    let americanFormattedValue = '';
    for (let i = 0; i < sourceContext.length; i++) {
        const char = sourceContext.charAt(i);

        if (isNumeric(char)) {
            americanFormattedValue += char;
        }

        else if(isSeparator(char)) {
            americanFormattedValue += isLastSeparator(sourceContext, i) ? '.' : '';
        }
    }

    const newValue = parseFloat(americanFormattedValue);
    context[contextId] = isNaN(newValue) ? undefined : parseFloat(americanFormattedValue);

    resolve();
});
