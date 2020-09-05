const getValueWithoutIrrelevantContent = require('../getValueWithoutIrrelevantContent');
const getPreparedCommandParameters = require('../getPreparedCommandParameters');

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
    console.log(informationToStore);

    resolve();
});
