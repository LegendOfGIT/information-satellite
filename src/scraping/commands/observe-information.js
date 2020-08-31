const httpClient = require('axios');
const getValueWithoutIrrelevantContent = require('../getValueWithoutIrrelevantContent');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { informationIds } = parameters;

    console.log('executing command "observe-information"');

    if (!informationIds) {
        console.log('required parameter "informationIds" is not given. abort.');
        resolve();
    }

    let informationToObserve = {};
    informationIds.forEach(informationId => {
        informationToObserve[informationId] = getValueWithoutIrrelevantContent(context[informationId]);
    });

    httpClient.put(
        'http://127.0.0.1:3001/observable-items',
        informationToObserve
    ).then(() => {
        console.log('information successfully sent to observation');
    });

    resolve();
});
