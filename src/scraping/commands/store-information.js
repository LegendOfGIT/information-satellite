const getValueWithoutIrrelevantContent = require('../getValueWithoutIrrelevantContent');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { informationIds } = parameters;

    console.log('executing command "store-information"');

    if (!informationIds) {
        console.log('required parameter "informationIds" is not given. abort.');
        resolve();
    }

    let informationToStore = {};
    informationIds.forEach(informationId => {
        informationToStore[informationId] = getValueWithoutIrrelevantContent(context[informationId]);
    });

    console.log(informationToStore);

    resolve();
});
