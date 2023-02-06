const httpClient = require('axios');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, uri } = parameters;

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

    const proxyHosts = [ '149.129.239.170', '132.129.121.148', '154.129.98.156', '211.129.132.150', '164.129.114.111' ];
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
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
