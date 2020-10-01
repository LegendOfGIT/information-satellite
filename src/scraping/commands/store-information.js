const getValueWithoutIrrelevantContent = require('../getValueWithoutIrrelevantContent');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');

const httpClient = require('axios');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { informationIds } = parameters;

    const commandParameters = getPreparedCommandParameters(Object.assign(
        {},
        parameters,
        context
    ));

    console.log('executing command "store-information"');

    if (!informationIds) {
        console.log('required parameter "informationIds" is not given. abort.');
        resolve();
    }

    let informationToStore = {};
    informationIds.forEach(informationId => {
        informationToStore[informationId] = getValueWithoutIrrelevantContent(context[informationId]);
    });
    informationToStore['itemId'] = commandParameters['template.itemId'];

    httpClient.put(
        'http://127.0.0.1:3002/information-item',
        informationToStore
    );
    console.log(informationToStore);

    resolve();
});
