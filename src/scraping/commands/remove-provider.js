const configuration = require('../../configuration/app-config')();

const httpClient = require('axios');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { flagId } = parameters;
    const { mean } = context;

    console.log('executing command "remove-provider"');

    if (!mean) {
        console.log('required parameter "mean" is not given. abort.');
        resolve();
        return;
    }

    if (!flagId || undefined === context[flagId] || false === context[flagId]) {
        console.log('flag is false. abort.');
        resolve();
        return;
    }

    const url = `http://${configuration.services.warehouse.host}:3002/api/information-item?mean=${mean}`;
    console.log(url);
    httpClient.delete(url).catch(() => {});

    resolve();
});
