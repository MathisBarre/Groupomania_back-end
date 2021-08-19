export default async function (fastify) {
  fastify.route({
    method: 'PATCH',
    url: '/users',
    schema: schema,
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler (request) {
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

    console.log(updatedUser)

    return { message: 'Update succeed' }
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
      message: { type: 'string' }
    }
  }
}

const schema = { ...documentation, response, body }
