export default async function (fastify) {
  fastify.route({
    method: 'POST',
    url: '/auth/logout',
    schema: schema,
    handler: handler
  })

  async function handler (request, reply) {
    reply.clearCookie('token', {
      domain: 'localhost',
      path: '/',
      secure: true, // send cookie over HTTPS only
      httpOnly: true,
      sameSite: true // alternative CSRF protection
    }).code(200).send({ message: 'User disconnected' })
  }
}

const documentation = {
  tags: ['Authentification'],
  summary: 'Disconnect an user',
  description: 'Disconnect an user by removing his jwt token cookie'
}

const response = {
  200: {
    type: 'object',
    properties: {
      message: { type: 'string' }
    }
  }
}

const schema = { ...documentation, response }
