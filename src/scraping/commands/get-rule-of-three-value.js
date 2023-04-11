module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-rule-of-three-value"')

    const { contextId, maximumValue } = parameters;

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!maximumValue) {
        console.log('required parameter "maximumValue" is not given. abort.');
        resolve();
    }

    const sourceContext = Object.call(context, contextId) ? context[contextId] : 0;

    if (!sourceContext) {
        console.log(`context with source context id "${contextId}" does not exist.`);
        resolve();
    }

    context[contextId] = Math.ceil((sourceContext * 100) / maximumValue);

    resolve();
});
