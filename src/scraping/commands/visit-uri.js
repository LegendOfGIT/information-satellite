const httpClient = require('axios');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');

const generateString = (length) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

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

    return httpClient({ url: commandParameters.uri, method: 'GET', headers: { 'user-agent': generateString(8), 'content-type': 'text/html', pragma: 'no-cache', 'upgrade-insecure-requests': 1 }})
        .then(response => {
            console.log(`requested uri "${commandParameters.uri}" was resolved successfully.`);
            if (contextId) {
                context[contextId] = response.data;
            }

            resolve();
        })
        .catch((e) => {
            console.log(`requested uri "${commandParameters.uri}" can not be resolved. abort`);
            console.log(e);
            resolve();
        });
});

