const httpClient = require('axios');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, uri } = parameters;

    console.log('executing command "visit-uri"');

    if (!uri) {
        console.log('required parameter "uri" is not given. abort.');
        resolve();
    }

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    const commandParameters = getPreparedCommandParameters(Object.assign(
        {},
        parameters,
        context,
        { uri: uri || '' }
    ));

    const options = {
        "headers": {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
        }
    };
    return httpClient.get(commandParameters.uri, options)
        .then(response => {
            console.log(`requested uri "${commandParameters.uri}" was resolved successfully.`);
            if (contextId) {
                context[contextId] = response.data;
            }

            resolve();
        })
        .catch((e) => {
            console.log(e);
            console.log(`requested uri "${commandParameters.uri}" can not be resolved. abort`);
            resolve();
        });
});
