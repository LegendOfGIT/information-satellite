const getValuesByRegex = require('../processing/getValuesByRegex');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-value-by-regex"')

    const { contextId, groupIndex, regex, setValueOnMatch, sourceContextId } = parameters;
    let { flags } = parameters;

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
    }

    if (!regex) {
        console.log('required parameter "regex" is not given. abort.');
        resolve();
    }

    const sourceContext = Object.call(context, sourceContextId) ? context[sourceContextId] : '';
    if (!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
    }

    const regexes = Array.isArray(regex) ? regex : [regex];
    const values = regexes.map(r => {
        const value = (getValuesByRegex(sourceContext, r, groupIndex, flags || 'g') || [''])[0];
        if (value) {
            return value;
        }
    }).filter(v => v);

    if (values.length) {
        context[contextId] = setValueOnMatch || values[0];
    }
    context[contextId] = context[contextId] || '';

    resolve();
});
