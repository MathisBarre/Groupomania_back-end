"use strict"

module.exports = async function (fastify, opts) {
  fastify.get("/login", async function(request, reply) {
    const token = await reply.jwtSign({
      name: 'foo',
      role: ['admin', 'spy']
    })
  
    reply
      .setCookie('token', token, {
        domain: 'localhost',
        path: '/',
        secure: true, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true // alternative CSRF protection
      })
      .code(200)
      .send('Cookie sent')
  })
}