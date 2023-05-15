function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}

module.exports = (value) => {
    if (!value || 'string' !== typeof(value)) {
        return value;
    }

    const irrelevantContent = [ '\r', '\n', '\t' ];
    irrelevantContent.forEach(content => {
        value = value.replace(content, '');
    });

    return unicodeToChar(value).trim();
}