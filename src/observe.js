const getScrapingTemplateBySiteAndUseCase = require('./scraping/getScrapingTemplateBySiteAndUseCase');
const applyScrapingTemplate = require('./scraping/applyScrapingTemplate');

module.exports = (siteId, useCaseId) => {
    const template = getScrapingTemplateBySiteAndUseCase(siteId, useCaseId);

    if(!template){
        return { error: 'NO_TEMPLATE_FOUND' };
    }

    applyScrapingTemplate(template);

    return {
        error: ''
    }
}