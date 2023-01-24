const configuration = require('../../configuration/app-config')();
const httpClient = require('axios');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');
const getValueWithoutIrrelevantContent = require('../getValueWithoutIrrelevantContent');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { informationIds } = parameters;

    const commandParameters = getPreparedCommandParameters(Object.assign(
        {},
        parameters,
        context
    ));

    console.log('executing command "observe-information"');

    if (!informationIds) {
        console.log('required parameter "informationIds" is not given. abort.');
        resolve();
    }

    let informationToObserve = {};
    informationIds.forEach(informationId => {
        informationToObserve[informationId] = getValueWithoutIrrelevantContent(context[informationId]);
    });
    informationToObserve['navigation-path'] = informationToObserve['navigation-path'] || commandParameters['template.navigationPath'];

    console.log(informationToObserve);

    httpClient.put(
        `http://${configuration.services.satelliteController.host}:3001/observable-items`,
        informationToObserve
    ).then(() => {
        console.log('information successfully sent to observation');
    })
    .catch(() => {});

    resolve();
});
