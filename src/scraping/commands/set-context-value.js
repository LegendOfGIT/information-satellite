const getPreparedCommandParameters = require('../getPreparedCommandParameters');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, contextIdIfFlag, replacements = {}, value, valueOnFalse, valueOnTrue } = parameters;

    console.log('executing command "set-context-value"');

    if (!value && !valueOnFalse && !valueOnTrue) {
        console.log('required parameter "value | valueOnFalse | valueOnTrue" is not given. abort.');
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

    context[contextId] =
        contextIdIfFlag
            ? true === commandParameters[contextIdIfFlag] || commandParameters[contextIdIfFlag] > 0 ? commandParameters.valueOnTrue : commandParameters.valueOnFalse
            : commandParameters.value;

    for (const [key, value] of Object.entries(replacements)) {
        context[contextId] = context[contextId].replace(new RegExp(key,"g"), value);
    }

    if (Array.isArray(context[contextId])) {
        resolve();
        return;
    }

    const contextValue = (context[contextId] || '');
    context[contextId] = 'string' === typeof contextValue
        ? (context[contextId] || '').replace(new RegExp('{.*?}',"g"), '')
        : contextValue;

    resolve();
});

