const getScrapingCommandById = require('./getScrapingCommandById');

module.exports = (template = {}, itemId, navigationPath) => {
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
                "template.itemId": template.itemId,
                "template.navigationPath": navigationPath,
                "template.site": template.site
            }
        );
        console.log(`add command "${commandId}" to execution list`);
        commands.push({
            command,
            parameters
        });
    });

    const executeNextCommand = (currentCommandIndex) => new Promise(resolve => {
        const command = commands.pop();

        if(!command){
            resolve();
        }

        currentCommandIndex = currentCommandIndex || 1;

        const promiseFn = command.command;

        promiseFn(context, command.parameters).then(() => {
            console.log(`executed command ${currentCommandIndex} of ${commands.length + currentCommandIndex}`);
            currentCommandIndex++;
            resolve(executeNextCommand(currentCommandIndex));
        });
    });

    commands.reverse();
    executeNextCommand().then(() => {
    });
}