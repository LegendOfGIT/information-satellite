module.exports = (commandId) => {
    try {
        return require(`../../scraping/commands/${commandId}.js`);
    }
    catch {}
}