module.exports = (siteId, useCaseId) => {
    try {
        return require(`../../scraping/${siteId}/${useCaseId}.json`);
    }
    catch {}
}