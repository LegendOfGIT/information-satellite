module.exports = (parameters) => {
    const preparedParameters = {};

    const hasAtLeastOneReplacer = (value) => -1 !== (value || '').indexOf('{');

    for (let [key, value] of Object.entries(parameters)) {
        if (!hasAtLeastOneReplacer(value)) {
            preparedParameters[key] = value;
            continue;
        }

        let replacedValue = value;
        for (let [replacementKey, replacementValue] of Object.entries(parameters)) {
            replacedValue = replacedValue.replace(`{${replacementKey}}`, replacementValue);

            if (!hasAtLeastOneReplacer(replacedValue)) {
                break;
            }
        }
        preparedParameters[key] = replacedValue;
    }

    return preparedParameters;
}