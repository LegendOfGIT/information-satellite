module.exports = (sourceContext, regex, groupIndex, flags = 'sg', tagReplacer = '') => {
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

        return v.replaceAll('\\u0026', '&').replaceAll('\\u003C', '<').replaceAll('\\u003E', '>').replaceAll('&apos;', '´')
            .replaceAll('&#43;', '+')
            .replaceAll('&nbsp;', ' ').replaceAll('&ndash;', '-')
            .replaceAll('&quot;', '"').replaceAll('&amp;', '&')
            .replaceAll('&auml;', 'ä').replaceAll('&Auml;', 'Ä')
            .replaceAll('&ouml;', 'ö').replaceAll('&Ouml;', 'Ö')
            .replaceAll('&uuml;', 'ü').replaceAll('&Uuml;', 'Ü')
            .replaceAll(/<.*?>/g, tagReplacer);
    })

    return values;
}
