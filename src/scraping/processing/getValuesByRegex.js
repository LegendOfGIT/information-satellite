module.exports = (sourceContext, regex, groupIndex) => {
    if (!sourceContext || !regex) {
        return [];
    }

    let values = [];
    const matches = sourceContext.matchAll(new RegExp(regex, 'g'));
    for (let match of matches) {
        values.push(match[groupIndex || 0]);
    }

    return values;
}
