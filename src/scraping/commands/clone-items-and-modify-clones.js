module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "clone-items-and-modify-clones"')

    const { contextId, sourceContextId, regex = undefined, replacements = {}, unique = false } = parameters;

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
        if (regex) {
            const matches = clonedItem.matchAll(new RegExp(regex, "g"));
            const matchingValues = [];
            for (let match of matches) {
                matchingValues.push(match.length > 1 ? match[1] : match[0]);
            }
            clonedItem = matchingValues && matchingValues.length ? matchingValues[0] : clonedItem;
        }

        for (const [key, value] of Object.entries(replacements)) {
            clonedItem = clonedItem.replace(new RegExp(key,"g"), value);
        }

        items.push((clonedItem || '').trim());
    });

    context[contextId] = unique
        ? items.filter((value, index, array) => array.indexOf(value) === index)
        : items;

    resolve();
});
