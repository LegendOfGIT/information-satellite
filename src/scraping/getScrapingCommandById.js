module.exports = (commandId) => {
    try {
        return require(`${process.cwd()}/src/scraping/commands/${commandId}`);
    }
    catch { }
}