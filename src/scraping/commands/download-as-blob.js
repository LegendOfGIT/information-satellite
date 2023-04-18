const https = require('https');

module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    console.log('executing command "get-value-by-regex"')

    const { contextId } = parameters;

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    const url = context[contextId];
    https.get(url, (res) => {
        const data = [];
        if (res.statusCode === 200) {
            res.on('data', function(chunk) {
                data.push(chunk);
            }).on('end', function() {
                context[contextId] = 'data:image/jpg;base64,' + Buffer.concat(data).toString('base64');
                console.log(`download of "${url}" was successful`);
                resolve();
            });
        } else {
            // Consume response data to free up memory
            res.resume();
            console.log(`download of "${url}" failed`);
            resolve();
        }
    });
});
