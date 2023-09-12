const {val} = require("cheerio/lib/api/attributes");
module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-float-from-value"')

    const { contextId, defaultValue, sourceContextId, multiplyBy = undefined } = parameters;

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
        console.log(`context with source context id "${sourceContextId}" does not exist.`);
        context[contextId] = defaultValue;
        resolve();
    }

    const isLastSeparator = (value, currentIndex) => {
        const restOfValue = value.substring(value.length, currentIndex + 1);

        return -1 === restOfValue.indexOf('.') && -1 === restOfValue.indexOf(',');
    };
    const isNumeric = (value) => /^\d+$/.test(value);
    const isSeparator = (value) => '.' === value || ',' === value;
    const fixExtensiveFollowingDigits = (value) => {
        const indexOfLastSeparator = value.indexOf('.');
        if (-1 === indexOfLastSeparator || -1 !== value.indexOf(',')) {
            return value;
        }

        if (indexOfLastSeparator > 2 || (value.length - indexOfLastSeparator) < 4) {
            return value;
        }

        return value.replace('.', '');
    }

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

    americanFormattedValue = fixExtensiveFollowingDigits(americanFormattedValue);

    const newValue = parseFloat(americanFormattedValue);
    context[contextId] = isNaN(newValue) ? defaultValue : parseFloat(americanFormattedValue);

    if (context[contextId] && multiplyBy) {
        context[contextId] = Number.parseFloat((context[contextId] * multiplyBy).toFixed(2));
    }

    resolve();
});
