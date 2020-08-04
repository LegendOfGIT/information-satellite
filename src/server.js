const fastify = require('fastify')({
    logger: true
});

fastify.get('/observe/site/:site/use-case/:useCase', async (request, reply) => {
    reply.type('application/json').code(200);

    const observe = require('./observe');
    reply.send(observe(
        request.params.site,
        request.params.useCase,
        request.query.itemId
    ));
})

fastify.listen(3000, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
