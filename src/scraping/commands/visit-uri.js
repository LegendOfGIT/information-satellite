const httpClient = require('axios');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, uri } = parameters;

    if(!uri) {
        console.log('required parameter "uri" is not given. abort.');
        resolve();
    }

    if(!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    const commandParameters = getPreparedCommandParameters(Object.assign(
        {},
        parameters,
        { uri }
    ));
    return httpClient.get(commandParameters.uri)
        .then(response => {
            console.log(`requested uri "${commandParameters.uri}" was resolved successfully.`);
            context[contextId] = response.data;

            resolve();
        })
        .catch(() => {
            console.log(`requested uri "${commandParameters.uri}" can not be resolved. abort`);
            resolve();
        });
});

