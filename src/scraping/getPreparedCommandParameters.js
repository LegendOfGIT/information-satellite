module.exports = (parameters) => {
    const preparedParameters = {};

    const hasAtLeastOneReplacer = (value) => -1 !== (value || '').indexOf('{');

    const isUriParameterAndDoesNotStartWithHttpS = (key, value) => (
        'uri' === key && !RegExp(/^https?:\/\//).test(value)
    );

    for (let [key, value] of Object.entries(parameters)) {
        if(isUriParameterAndDoesNotStartWithHttpS(key, value) && parameters['template.site']){
            value = `https://{template.site}${value}`;
        }

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