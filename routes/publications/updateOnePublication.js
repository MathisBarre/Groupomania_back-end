export default async function (fastify) {
  fastify.route({
    method: 'PATCH',
    url: '/publications',
    schema: schema,
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler (request) {
    const { title, imageUrl, authorId, publicationId } = request.body
    const { userId, role } = fastify.jwt.decode(request.cookies.token)

    const publicationToUpdate = await fastify.prisma.publication.findUnique({
      where: {
        id: publicationId
      },
      include: {
        user: true
      }
    })

    if ((publicationToUpdate.user.id === userId && userId === authorId) || role === 'admin') {
      await fastify.prisma.publication.update({
        where: {
          id: publicationId
        },
        data: {
          title: title,
          image_url: imageUrl,
          author_id: authorId
        }
      })

      return { message: 'Publication successfully updated' }
    } else {
      throw fastify.httpErrors.unauthorized('The user is not authorized to update this publication')
    }
  }
}

const documentation = {
  tags: ['Publications'],
  summary: 'Update a publication',
  description: 'Update a publication'
}

const body = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    imageUrl: { type: 'string' },
    authorId: { type: 'number' },
    publicationId: { type: 'number' }
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

const schema = { ...documentation, body, response }
