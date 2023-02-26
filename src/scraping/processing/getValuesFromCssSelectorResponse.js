module.exports = (cssSelectorResponse, attributeId, mustContain) => {
    const valuesFromCssSelectorResponse = [];

    const removeControlCharacters = (value) => value
        .replace(/\r/g, '')
        .replace('\r', '')
        .replace(/\n/g, '')
        .replace('\n', '');
        //.replace(' ', '');

    cssSelectorResponse = cssSelectorResponse || { get: () => {} };
    const results = cssSelectorResponse.get() || [];
    results.forEach((result) => {
        const currentResult = result || { attribs: [] };

        if (attributeId && currentResult.attribs[attributeId]) {
            const value = currentResult.attribs[attributeId].trim();
            if (mustContain && -1 === value.indexOf(mustContain)) {
                return;
            }

            valuesFromCssSelectorResponse.push(currentResult.attribs[attributeId].trim());

            return;
        }

        let children = (currentResult || {
            children: [{}]
        }).children || [];

        const childContainsRelevantInformation = (child) => {
            if ('text' !== child.type) {
                return false;
            }

            if (mustContain && -1 === child.data.indexOf(mustContain)) {
                return false;
            }

            return removeControlCharacters(child.data);
        };

        children = children.filter(c => childContainsRelevantInformation(c));

        if (children.length > 0) {
            valuesFromCssSelectorResponse.push((children.map(c => removeControlCharacters(c.data)).join('') || '').trim());
        }
    });

    return valuesFromCssSelectorResponse;
}
