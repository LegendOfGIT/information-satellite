const httpClient = require('axios');

module.exports = (context = {}, parameters = {}) => {
    return new Promise(resolve => {
        const { contextId, uri } = parameters;

        if(!uri) {
            console.log('required parameter "uri" is not given. abort.');
            resolve();
        }

        if(!contextId) {
            console.log('required parameter "contextId" is not given. abort.');
            resolve();
        }

        httpClient.get(uri)
            .then(response => {
                console.log(`requested uri "${uri}" was resolved successfully.`);
                console.log(response.data);
                context[contextId] = response.data;
            })
            .catch(() => {
                console.log(`requested uri "${uri}" can not be resolved. abort`)
            });

        resolve();
    });
}
