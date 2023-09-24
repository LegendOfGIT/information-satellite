module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "zip-contexts-to-context"')

    const { contextId, exchangeFromWhenEmpty, exchangeToWhenEmpty, sourceContextIds } = parameters;

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!sourceContextIds || !sourceContextIds.length) {
        console.log('required parameter "sourceContextIds" is not given. abort.');
        resolve();
    }

    const sourceContexts = sourceContextIds.map(sourceContextId => Object.call(context, sourceContextId) ? context[sourceContextId] : undefined);

    if (sourceContexts.filter(sourceContext => undefined === sourceContext).length > 0) {
        console.log(`At least one of given source contexts does not exist.`);
        resolve();
    }

    const zippedContext = [];
    for (let x= 0;x < sourceContexts[0].length; x++) {
        const zipped = {};
        let propertyKey = sourceContextIds[0].split('.').length > 1 ? sourceContextIds[0].split('.')[1] : sourceContextIds[0];
        zipped[propertyKey] = (sourceContexts[0][x] || '').trim();

        for (let y = 1; y < sourceContexts.length; y++) {
            propertyKey = sourceContextIds[y].split('.').length > 1 ? sourceContextIds[y].split('.')[1] : sourceContextIds[y];
            zipped[propertyKey] = sourceContexts[y].length > x ? (sourceContexts[y][x] || '').trim() : '';
        }

        if ((exchangeFromWhenEmpty && exchangeToWhenEmpty) && !zipped[exchangeToWhenEmpty]) {
            zipped[exchangeToWhenEmpty] = zipped[exchangeFromWhenEmpty];
            zipped[exchangeFromWhenEmpty] = '';
        }

        zippedContext.push(zipped);
    }

    context[contextId] = zippedContext;

    resolve();
});
