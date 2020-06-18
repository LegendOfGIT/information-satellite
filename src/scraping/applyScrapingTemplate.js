const getScrapingCommandById = require('./getScrapingCommandById');

module.exports = (template = {}) => {
    console.log('Let us scrape!');

    if(!template.scraping) {
        console.log('nothing to scrape. stopping.');
        return;
    }

    let context = {};

    template.scraping.forEach(templateCommand => {
        const commandId = templateCommand.commandId || '';
        console.log(`apply scraping command "${commandId}"`);

        const command = getScrapingCommandById(commandId);
        if (!command) {
            console.log(`command "${commandId}" is not defined`);
            return;
        }

        console.log(`execute command "${commandId}"`);
        command(
            context,
            templateCommand.parameters
        );
    });
    
    console.log(context);
}