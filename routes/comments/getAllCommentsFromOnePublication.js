export default async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/comments/:publicationId',
    schema: schema,
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler (request) {
    const allCommentsFromOnePublication = await fastify.prisma.comment.findMany({
      where: {
        publication_id: parseInt(request.params.publicationId, 10)
      },
      select: {
        id: true,
        content: true,
        publication_id: true,
        author_id: true,
        date_creation: true,
        user: {
          select: {
            display_name: true,
            profile_image_url: true
          }
        }
      },
      orderBy: [
        { id: 'asc' }
      ]
    })

    return allCommentsFromOnePublication
  }
}

const documentation = {
  tags: ['Comments'],
  summary: 'Get all comments from one publication',
  description: 'Get all comments from one publication'
}

const params = {
  type: 'object',
  properties: {
    publicationId: { type: 'number' }
  }
}

const response = {
  200: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        content: { type: 'string' },
        publication_id: { type: 'number' },
        author_id: { type: 'string' },
        date_creation: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            display_name: { type: 'string' },
            profile_image_url: { type: 'string' }
          }
        }
      }
    }
  }
}

const schema = { ...documentation, params, response }
