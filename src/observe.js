const getScrapingTemplateBySiteAndUseCase = require('./scraping/getScrapingTemplateBySiteAndUseCase');

module.exports = (siteId, useCaseId) => {
    const template = getScrapingTemplateBySiteAndUseCase(siteId, useCaseId);

    if(!template){
        return { error: 'NO_TEMPLATE_FOUND' };
    }

    return {
        error: ''
    }
}