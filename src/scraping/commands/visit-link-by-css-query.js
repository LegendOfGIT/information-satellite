module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, sourceContextId } = parameters;

    console.log('executing command "visit-link-by-css-query"');

    if(!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if(!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
    }

    const sourceContext = context[contextId];
    if(!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
    }

    resolve();
});
