module.exports = (template = {}) => {
    console.log('Let us scrape!');

    if(!template.scraping) {
        console.log('nothing to scrape. stopping.');
        return;
    }

    template.scraping.forEach(scrapingCommand => {
        console.log(`apply scraping command "${scrapingCommand.command || ''}"`);
    });
}