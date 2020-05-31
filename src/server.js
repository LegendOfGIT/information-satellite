const axios = require('axios');
const cheerio = require('cheerio');

const fastify = require('fastify')({
    logger: true
});

fastify.get('/', async (request, reply) => {
    reply.type('application/json').code(200);

    axios.get(
        'https://www.nintendo.de/Nintendo-eShop/Charts/Nintendo-eShop-Charts-1396788.html'
    ).then(rawResponse => {
        const cssSelector = cheerio.load(rawResponse.data);

        const response = [];
        cssSelector('.page-list-group-item a').get().forEach(item => {
            response.push({
                title: item.attribs['title']
            });
        });

        reply.send(response);
    })
    .catch(() => {
        reply.send([]);
    });
});

fastify.listen(3000, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
