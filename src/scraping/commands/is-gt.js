module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, contextIdValueA, contextIdValueB } = parameters;

    console.log('executing command "is-gt"');

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    context[contextId] = context[contextIdValueA || ''] > context[contextIdValueB || ''];

    resolve();
});

