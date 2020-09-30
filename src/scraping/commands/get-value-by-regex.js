module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-value-by-regex"')

    const { contextId, regex, sourceContextId } = parameters;

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
    }

    if (!regex) {
        console.log('required parameter "regex" is not given. abort.');
        resolve();
    }

    const sourceContext = Object.call(context, sourceContextId) ? context[sourceContextId] : '';
    if (!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
    }

    const groupIndex = 1;
    const value = (sourceContext.match(new RegExp(regex)) || [])[groupIndex];
    console.log('sourceContext');
    console.log(sourceContext);
    console.log('regex');
    console.log(regex);
    console.log('value');
    console.log(value);
    if (value) {
        context[contextId] = value;
    }

    resolve();
});
