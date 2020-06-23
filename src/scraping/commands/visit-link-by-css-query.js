const cheerio = require('cheerio');
const visitUriCommand = require('./visit-uri');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "visit-link-by-css-query"')

    const { contextId, sourceContextId } = parameters;

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
    }

    const sourceContext = Object.call(context, sourceContextId) ? context[sourceContextId] : '';

    if (!sourceContext) {
        console.log(`context with source context id "${sourceContextId}" does not exist. abort.`);
        resolve();
    }

    const cssQuery = parameters['css-query'] || '';
    const cssSelector = cheerio.load(sourceContext);
    const uri = cssSelector(cssQuery).attr('href');

    resolve(
        visitUriCommand(
            context,
            {
                contextId,
                uri,
                'template.site': parameters['template.site']
            }
        )
    );
});
