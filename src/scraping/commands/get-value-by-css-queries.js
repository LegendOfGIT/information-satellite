const cheerio = require('cheerio');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-value-by-css-queries"')

    const { contextId, sourceContextId } = parameters;
    const cssQueries = parameters['css-queries'];

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
    }

    if (!cssQueries) {
        console.log('required parameter "css-queries" is not given. abort.');
        resolve();
    }

    const sourceContext = Object.call(context, sourceContextId) ? context[sourceContextId] : '';
    if (!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
    }

    const getValueFromCssSelect = (cssSelectorResponse) => {
        let children = (cssSelectorResponse.get()[0] || {
            children: [{}]
        }).children;

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

        if (0 === children.length) {
            return '';
        }

        return children.map(c => c.data).join('') || '';
    };

    const cssSelector = cheerio.load(sourceContext);
    cssQueries.forEach(cssQuery => {
        if(context[contextId]) {
            return;
        }

        context[contextId] = getValueFromCssSelect(cssSelector(cssQuery));
    });

    resolve();
});
