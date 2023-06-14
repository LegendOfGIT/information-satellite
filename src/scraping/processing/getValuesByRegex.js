module.exports = (sourceContext, regex, groupIndex, flags = 'sg') => {
    sourceContext = Array.isArray(sourceContext) ? sourceContext : [sourceContext];

    if (!sourceContext || !regex) {
        return [];
    }

    let values = [];

    sourceContext.forEach((sourceContextItem) => {
        const matches = sourceContextItem.matchAll(new RegExp(regex, flags));
        for (let match of matches) {
            values.push(match[groupIndex || 0]);
        }
    });

    values = values.map(v => {
        if (!v) {
            return v;
        }

        return v.replaceAll('&apos;', '´').replaceAll('&quot;', '"');
    })

    return values;
}
