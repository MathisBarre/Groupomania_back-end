export default async function(fastify) {
  fastify.route({
    method: "POST",
    url: "/auth/logout",
    handler: handler
  })

  async function handler(request, reply) {
    reply.clearCookie('token', {
      domain: "localhost",
      path: "/",
      secure: true, // send cookie over HTTPS only
      httpOnly: true,
      sameSite: true // alternative CSRF protection
    }).code(200).send({ message: "User disconnected"})
  }
}