export default async function (fastify) {
  fastify.route({
    method: 'POST',
    url: '/publications',
    schema: schema,
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler (request) {
    const { title, imageUrl } = request.body
    const { userId } = fastify.jwt.decode(request.cookies.token)

    await fastify.prisma.publication.create({
      data: {
        title: title,
        image_url: imageUrl,
        author_id: userId
      }
    })

    return { message: 'Publication successfully created' }
  }
}

const documentation = {
  tags: ['Publications'],
  summary: 'Create a publication',
  description: 'Create a publication'
}

const body = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    imageUrl: { type: 'string' },
    authorId: { type: 'number' }
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
