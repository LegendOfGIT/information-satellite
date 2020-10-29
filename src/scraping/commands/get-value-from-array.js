module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-value-from-array"')

    const { contextId, index = 0, sourceContextId } = parameters;

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
        return;
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
        return;
    }

    let sourceContext = Object.prototype.hasOwnProperty.call(context, sourceContextId) ? context[sourceContextId] : '';
    if (!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
        return;
    }

    sourceContext = Array.isArray(sourceContext) ? sourceContext : [ sourceContext ];
    if (sourceContext.length > index + 1) {
        context[contextId] = sourceContext[index];
    }

    resolve();
});
