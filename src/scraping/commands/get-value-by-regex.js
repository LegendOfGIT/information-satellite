const getValuesByRegex = require('../processing/getValuesByRegex');
const getPreparedCommandParameters = require("../getPreparedCommandParameters");

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-value-by-regex"')

    const {
        contextId,
        flags,
        groupIndex,
        removeTags = true,
        replacements = {},
        setValueOnMatch,
        sourceContextId,
        tagReplacer = ''
    } = parameters;

    const commandParameters = getPreparedCommandParameters(Object.assign(
        {},
        parameters,
        context
    ));
    const {
        regex
    } = commandParameters;

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
        const value = (getValuesByRegex(sourceContext, r, groupIndex, flags || 'g', tagReplacer, removeTags) || [''])[0];
        if (value) {
            return value;
        }
    }).filter(v => v && v !== 'null');

    if (values.length) {
        context[contextId] = setValueOnMatch || values[0];
    }
    context[contextId] = context[contextId] || '';
    for (const [key, value] of Object.entries(replacements)) {
        context[contextId] = context[contextId].replace(new RegExp(key,"g"), value);
    }

    resolve();
});
