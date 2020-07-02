module.exports = (value) => {
    if (!value || 'string' !== typeof(value)) {
        return value;
    }

    const irrelevantContent = [ '\r', '\n', '\t' ];
    irrelevantContent.forEach(content => {
        value = value.replace(content, '');
    });

    return value.trim();
}