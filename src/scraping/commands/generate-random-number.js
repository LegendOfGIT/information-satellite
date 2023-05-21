module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, maximum, minimum = 1 } = parameters;

    console.log('executing command "generate-random-number"');

    if (!maximum) {
        console.log('required parameter "maximum" is not given. abort.');
        resolve();
    }

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    context[contextId] = Math.floor(Math.random() * Math.floor(maximum - 1)) + minimum;

    resolve();
});

