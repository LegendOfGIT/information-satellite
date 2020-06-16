const getScrapingCommandById = require('./getScrapingCommandById');

module.exports = (template = {}) => {
    console.log('Let us scrape!');

    if(!template.scraping) {
        console.log('nothing to scrape. stopping.');
        return;
    }

    template.scraping.forEach(scrapingCommand => {
        const commandId = scrapingCommand.commandId || '';
        console.log(`apply scraping command "${commandId}"`);

        const command = getScrapingCommandById(commandId);
        if(!command) {
            console.log(`command "${commandId}" is not defined`);
        }
    });
}