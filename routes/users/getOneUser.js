export default async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/users/:userId',
    schema: schema,
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler (request) {
    const requestUserId = parseInt(request.params.userId, 10)
    const trueUserId = parseInt(fastify.jwt.decode(request.cookies.token).userId, 10)

    if (requestUserId !== trueUserId) throw fastify.httpErrors.unauthorized()

    const user = await fastify.prisma.user.findUnique({
      where: {
        id: requestUserId
      }
    })

    return {
      displayName: user.display_name,
      email: user.email
    }
  }
}

const documentation = {
  tags: ['Users'],
  summary: 'Get one users',
  description: 'Get one users'
}

const response = {
  200: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      display_name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      profile_image_url: { type: 'string' },
      role: { type: 'string' },
      date_creation: { type: 'string' },
      date_update: { type: 'string' },
      date_creation_fr: { type: 'string' }
    }
  }
}

const schema = { ...documentation, response }
