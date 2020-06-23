const getScrapingCommandById = require('./getScrapingCommandById');

module.exports = (template = {}, itemId) => {
    console.log('Let us scrape!');

    if(!template.scraping) {
        console.log('nothing to scrape. stopping.');
        return;
    }

    let context = {};

    const commands = [];
    template.scraping.forEach(templateCommand => {
        const commandId = templateCommand.commandId || '';
        console.log(`apply scraping command "${commandId}"`);

        const command = getScrapingCommandById(commandId);
        if (!command) {
            console.log(`command "${commandId}" is not defined`);
            return;
        }

        const parameters = Object.assign(
            templateCommand.parameters,
            {
                "request.query.itemId": itemId,
                "template.site": template.site
            }
        );
        console.log(`add command "${commandId}" to execution list`);
        commands.push({
            command,
            parameters
        });
    });

    const executeNextCommand = () => new Promise(resolve => {
        const command = commands.pop();

        if(!command){
            resolve();
        }

        const promiseFn = command.command;

        promiseFn(context, command.parameters).then(() => {
            resolve(executeNextCommand());
        });
    });

    commands.reverse();
    executeNextCommand().then(() => { console.log(Object.keys(context)); });
}