const request = require('request');
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

    request(
        {
            headers: {
                'User-Agent': generateString(8)
            },
            uri: commandParameters.uri,
            method: 'GET'
        }, 
        function (err, res, body) {
            if (err) {
                console.log(`requested uri "${commandParameters.uri}" can not be resolved. abort`);
                resolve();
                return;
            }
            
            if (contextId) {
                context[contextId] = body;
            }
            
            resolve();
        }
    );
});

