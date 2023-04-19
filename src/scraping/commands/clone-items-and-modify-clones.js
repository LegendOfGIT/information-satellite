module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "clone-items-and-modify-clones"')

    const { contextId, sourceContextId, replacements = {}, unique = false } = parameters;

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
    }

    const sourceContext = Object.call(context, sourceContextId) ? context[sourceContextId] : [];

    if (!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
    }

    let items = [];
    sourceContext.forEach(item => {
        let clonedItem = item;
        for (const [key, value] of Object.entries(replacements)) {
            clonedItem = clonedItem.replace(new RegExp(key,"g"), value);
        }

        items.push(clonedItem);
    });

    context[contextId] = unique
        ? items.filter((value, index, array) => array.indexOf(value) === index)
        : items;

    resolve();
});
