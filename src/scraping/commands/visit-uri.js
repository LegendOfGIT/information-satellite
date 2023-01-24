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
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
            "Accept-Language": 'de-DE, de;q=0.5'
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
        .catch(() => {
            console.log(`requested uri "${commandParameters.uri}" can not be resolved. abort`);
            resolve();
        });
});

