const httpClient = require('axios');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');
const https = require('https');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, uri, encoding = 'utf-8' } = parameters;

    console.log('executing command "visit-uri"');

    if (!uri) {
        console.log('required parameter "uri" is not given. abort.');
        resolve();
        return;
    }

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
        return;
    }

    const commandParameters = getPreparedCommandParameters(Object.assign(
        {},
        parameters,
        context,
        { uri: uri || '' }
    ));

    console.log('visit uri: ' + commandParameters.uri);
    if (/{.*?}/.test(commandParameters.uri)) {
        console.log('at least one uri argument was not resolved. abort');
        resolve();
        return;
    }

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        responseType:'arraybuffer'
    };

    if (context[contextId]) {
        context['current-uri'] = commandParameters.uri;
        console.log(`requested uri "${commandParameters.uri}" was already resolved successfully.`);

        resolve();
        return;
    }

    return httpClient.get(commandParameters.uri, options)
        .then(response => {
            context['current-uri'] = commandParameters.uri;

            console.log(`requested uri "${commandParameters.uri}" was resolved successfully.`);
            if (contextId) {
                context[contextId] = response.data.toString(encoding);
            }

            resolve();
        })
        .catch((e) => {
            console.log(`requested uri "${commandParameters.uri}" can not be resolved. abort`);
            resolve();
        });
});
