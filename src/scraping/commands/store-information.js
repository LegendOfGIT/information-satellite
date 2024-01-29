const configuration = require('../../configuration/app-config')();
const getValueWithoutIrrelevantContent = require('../getValueWithoutIrrelevantContent');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');

const httpClient = require('axios');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { flagId, informationIds, requiredProperties } = parameters;

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

    if (flagId && !context[flagId]) {
        console.log('"flagId" is false. abort.');
        resolve();
        return;
    }

    const notGivenRequiredParameters = (requiredProperties || []).filter(requiredProperty => !commandParameters[requiredProperty]);
    if (notGivenRequiredParameters.length) {
        console.log(`required parameter(s) "${notGivenRequiredParameters.join(', ')}" is/are not given. abort.`);
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
        `http://${configuration.services.warehouse.host}:3002/api/information-item`,
        informationToStore
    ).catch(() => {});
    console.log(informationToStore);

    resolve();
});
