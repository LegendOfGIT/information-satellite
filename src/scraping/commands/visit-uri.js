const httpClient = require('axios');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');
const https = require('https');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, uri, encoding = 'utf-8', overwrite = false } = parameters;

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

    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; Trident/5.0)',
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; MDDCJS)',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
        'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
    ];

    const options = {
        headers: {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        responseType:'arraybuffer'
    };

    if (!overwrite && context[contextId]) {
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
