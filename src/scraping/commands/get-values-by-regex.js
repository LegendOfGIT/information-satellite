const getValuesByRegex = require('../processing/getValuesByRegex');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-values-by-regex"')

    const { contextId, groupIndex, regex, sourceContextId } = parameters;

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

    const values = getValuesByRegex(sourceContext, regex, groupIndex);
    if (values) {
        context[contextId] = values;
    }

    resolve();
});
