module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, separators = [',', ':', '/', '&', ';', 'und'] } = parameters;

    console.log('executing command "explode-values"');

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    let values = context[contextId] ? context[contextId] : [];
    values = Array.isArray(values) ? values : [values];

    let explodedValues = values;
    separators.forEach(separator => {
        explodedValues.map(explodedValue => explodedValue.split(separator))
            .flat()
            .forEach(value => explodedValues.push(value.trim()));
    });

    separators.forEach(separator => {
        explodedValues = explodedValues.filter(explodedValue => -1 === explodedValue.indexOf(separator));
    });

    context[contextId] = explodedValues.filter((value, index, array) =>
        array.indexOf(value) === index).sort();

    resolve();
});

