const getScrapingTemplateBySiteAndUseCase = require('./scraping/getScrapingTemplateBySiteAndUseCase');
const applyScrapingTemplate = require('./scraping/applyScrapingTemplate');

module.exports = (siteId, useCaseId, itemId, navigationPath) => {
    const template = getScrapingTemplateBySiteAndUseCase(siteId, useCaseId);

    if(!template){
        return { error: 'NO_TEMPLATE_FOUND' };
    }

    applyScrapingTemplate(template, itemId, navigationPath);

    return {
        error: ''
    }
}