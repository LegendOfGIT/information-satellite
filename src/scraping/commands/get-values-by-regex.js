const getValuesByRegex = require('../processing/getValuesByRegex');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-values-by-regex"')

    const {
        contextId,
        groupIndex,
        regex,
        replacements = {},
        removeTags = true,
        separator = undefined,
        sourceContextId,
        unique = false
    } = parameters;

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

    let values = [];
    const regexes = Array.isArray(regex) ? regex : [regex];
    regexes.forEach(regex => {
        values = values && values.length
            ? values
            : getValuesByRegex(sourceContext, regex, groupIndex, undefined, undefined, removeTags);
    });

    values = values.map(value => {
        for (const [key, replacementValue] of Object.entries(replacements)) {
            value = value.replace(new RegExp(key,"g"), replacementValue);
        }
        return value;
    })

    if (unique) {
        values = values.filter((value, index, array) => array.indexOf(value) === index);
    }
    if (values) {
        context[contextId] = separator ? values.join(separator) : values;
    }

    resolve();
});
