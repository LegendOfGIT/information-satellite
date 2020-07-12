const getPreparedCommandParameters = require('../getPreparedCommandParameters');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, value } = parameters;

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
        parameters
    ));

    context[contextId] = commandParameters.value;

    resolve();
});

