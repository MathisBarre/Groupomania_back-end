export default async function (fastify) {
  fastify.route({
    method: 'POST',
    url: '/comments',
    schema: schema,
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler (request, reply) {
    const { comment, publicationId } = request.body
    const { userId } = fastify.jwt.decode(request.cookies.token)

    await fastify.prisma.comment.create({
      data: {
        content: comment,
        publication_id: publicationId,
        author_id: userId
      }
    })

    return { message: 'Comment added successfully !' }
  }
}

const documentation = {
  tags: ['Comments'],
  summary: 'Create one comment',
  description: 'Create one comment by providing the publication ID'
}

const body = {
  type: 'object',
  properties: {
    comment: { type: 'string' },
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
