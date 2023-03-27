const getPreparedCommandParameters = require('../getPreparedCommandParameters');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, replacements = {}, value } = parameters;

    console.log('executing command "set-context-value"');

    if (!value) {
        console.log('required parameter "value" is not given. abort.');
        resolve();
    }

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    const commandParameters = getPreparedCommandParameters(Object.assign(
        {},
        parameters,
        context
    ));

    context[contextId] = commandParameters.value;
    for (const [key, value] of Object.entries(replacements)) {
        context[contextId] = context[contextId].replace(new RegExp(key,"g"), value);
    }

    if (Array.isArray(context[contextId])) {
        resolve();
        return;
    }

    context[contextId] = (context[contextId] || '').replace(new RegExp('{.*?}',"g"), '');

    resolve();
});

