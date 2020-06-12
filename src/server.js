const axios = require('axios');
const cheerio = require('cheerio');

const fastify = require('fastify')({
    logger: true
});

fastify.get('/', async (request, reply) => {
    reply.type('application/json').code(200);

    axios.get(
        'https://www.mytoys.de/spielzeug-spiele/kleinkindspielzeug/'
    ).then(rawResponse => {
        const cssSelector = cheerio.load(rawResponse.data);

        const response = [];
        cssSelector('.prod-tile').get().forEach(item => {
            const cssItemSelector = cheerio.load(cheerio.html(item));
            const itemLink = cssItemSelector('a').get()[0];

            const priceOld =
                (cssItemSelector('.prod-tile__price-old').get()[0] || {
                    children: [{}]
                }).children[0].data;
            const priceReduced =
                (cssItemSelector('.prod-tile__price-reduced').get()[0] || {
                    children: [{}]
                }).children[0].data;
            const priceRegular =
                (cssItemSelector('.prod-tile__price-regular').get()[0] || {
                    children: [{}]
                }).children[0].data;

            response.push({
                "current-price": priceReduced || priceRegular,
                "product-link": itemLink.attribs['href'],
                price: priceOld || priceRegular,
                title: itemLink.attribs['title']
            });
        });

        reply.send(response);
    })
    .catch(() => {
        reply.send([]);
    });
});
fastify.get('/observe/site/:site/use-case/:useCase', async (request, reply) => {
    const observe = require('./observe');
    reply.send(observe(request.params.site, request.params.useCase));
})

fastify.listen(3000, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
