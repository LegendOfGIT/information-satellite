module.exports = (cssSelectorResponse, attributeId) => {
    const valuesFromCssSelectorResponse = [];

    cssSelectorResponse = cssSelectorResponse || { get: () => {} };
    const results = cssSelectorResponse.get() || [];
    results.forEach((result) => {
        const currentResult = result || { attribs: [] };

        if (attributeId && currentResult.attribs[attributeId]) {
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

            return child.data
                .replace('\r', '')
                .replace('\n', '')
                .replace(' ', '');
        };

        children = children.filter(c => childContainsRelevantInformation(c));

        if (children.length > 0) {
            valuesFromCssSelectorResponse.push((children.map(c => c.data).join('') || '').trim());
        }
    });

    return valuesFromCssSelectorResponse;
}
