"use strict"

module.exports = async function (fastify, opts) {
  fastify.get("/login", async function(request, reply) {
    const token = await reply.jwtSign({
      name: 'foo',
      role: ['admin', 'spy']
    })
  
    reply
      .setCookie('token', token)
      .code(200)
      .send('Cookie sent')
  })

  fastify.get('/verifycookie', { preValidation: [fastify.authenticate] } ,(request, reply) => {
    reply.send({ code: 'OK', message: 'it works!' })
  })
}