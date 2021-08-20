export default async function (fastify) {
  fastify.route({
    method: 'PATCH',
    url: '/users',
    schema: schema,
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler (request, reply) {
    const { userId } = fastify.jwt.decode(request.cookies.token)
    const { email, display_name: displayName, profile_image_url: profileImageUrl } = request.body

    const updatedUser = await fastify.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        email: email,
        display_name: displayName,
        profile_image_url: profileImageUrl
      }
    })

    const returnedUser = {
      id: updatedUser.id,
      displayName: updatedUser.display_name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImageUrl: updatedUser.profile_image_url
    }

    reply
      .setCookie('connectedUser', JSON.stringify(returnedUser), {
        domain: 'localhost',
        path: '/',
        secure: true,
        httpOnly: false,
        sameSite: true
      })
      .code(200)
      .send(returnedUser)
  }
}

const documentation = {
  tags: ['Users'],
  summary: 'Update one user',
  description: 'Update one user'
}

const body = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    display_name: { type: 'string' },
    profile_image_url: { type: 'string' }
  }
}

const response = {
  200: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      displayName: { type: 'string' },
      email: { type: 'string' },
      role: { type: 'string' },
      profileImageUrl: { type: 'string' }
    }
  }
}

const schema = { ...documentation, response, body }
