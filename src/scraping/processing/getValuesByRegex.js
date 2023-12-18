module.exports = (sourceContext, regex, groupIndex, flags = 'sg', tagReplacer = '', removeTags = true) => {
    sourceContext = Array.isArray(sourceContext) ? sourceContext : [sourceContext];

    if (!sourceContext || !regex) {
        return [];
    }

    let values = [];

    const groupIndexes = Array.isArray(groupIndex) ? groupIndex : [groupIndex || 0];
    sourceContext.forEach((sourceContextItem) => {
        const matches = sourceContextItem.matchAll(new RegExp(regex, flags));
        for (let match of matches) {
            for (let gi of groupIndexes) {
                if (match[gi]) {
                    values.push(match[gi]);
                }
            }
        }
    });

    values = values.map(v => {
        if (!v) {
            return v;
        }

        let val = v.replaceAll('\\u0026', '&').replaceAll('\\u003C', '<').replaceAll('\\u003c', '<').replaceAll('\\u003E', '>').replaceAll('\\u003e', '>').replaceAll('&apos;', '´')
            .replaceAll('\\n', ' ')
            .replaceAll('&#43;', '+')
            .replaceAll('&#8722;', '-')
            .replaceAll('&nbsp;', ' ').replaceAll('&ndash;', '-')
            .replaceAll('&quot;', '"').replaceAll('&amp;', '&')
            .replaceAll('&auml;', 'ä').replaceAll('&Auml;', 'Ä')
            .replaceAll('&ouml;', 'ö').replaceAll('&Ouml;', 'Ö')
            .replaceAll('&uuml;', 'ü').replaceAll('&Uuml;', 'Ü')
            .replaceAll('&szlig;', 'ß');

        if (!removeTags) {
            return val;
        }

        return val.replaceAll(/<.*?>/g, tagReplacer);
    })

    return values;
}
