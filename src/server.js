const observe = require("./observe");
const configuration = require('./configuration/app-config')();
const observeConfiguration = require('./configuration/observe-config');
const fastify = require('fastify')({
    logger: true
});

fastify.get('/observe/configuration', async (request, reply) => {
    reply.type('application/json').code(200);
    reply.send(observeConfiguration);
});

fastify.get('/observe/site/:site/use-case/:useCase', async (request, reply) => {
    reply.type('application/json').code(200);

    reply.send(observe(
        request.params.site,
        request.params.useCase,
        request.query.itemId,
        request.query.itemCanonical,
        (request.query.navigationPath || '').split(',')
    ));
});

fastify.listen({ host: configuration.application.host, port: 3000 }, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
