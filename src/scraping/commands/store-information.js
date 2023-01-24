const configuration = require('../../configuration/app-config')();
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
        return;
    }

    let informationToStore = {};
    informationIds.forEach(informationId => {
        informationToStore[informationId] = getValueWithoutIrrelevantContent(context[informationId]);
    });
    informationToStore['itemId'] = commandParameters['template.itemId'];
    informationToStore['navigationPath'] = commandParameters['template.navigationPath'];

    if (!informationToStore.link) {
        console.log('required context information "link" is not given. abort.');
        resolve();
        return;
    }

    if (!informationToStore.title) {
        console.log('required context information "title" is not given. abort.');
        resolve();
        return;
    }

    informationToStore.updatedOn = new Date();
    httpClient.put(
        `http://${configuration.services.warehouse.host}:3002/information-item`,
        informationToStore
    ).catch(() => {});
    console.log(informationToStore);

    resolve();
});
