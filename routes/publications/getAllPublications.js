import dayjs from 'dayjs'

export default async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/publications',
    schema: schema,
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler () {
    let allPublication = await fastify.prisma.publication.findMany({
      orderBy: [
        { id: 'desc' }
      ],
      include: {
        user: true,
        _count: {
          select: { comment: true }
        }
      }
    })

    allPublication = allPublication.map((publication) => {
      publication.date_creation_fr = dayjs(publication.date_creation).format('DD MMMM YYYY [à] HH:mm')
      return publication
    })

    return allPublication
  }
}

const documentation = {
  tags: ['Publications'],
  summary: 'Get all publications',
  description: 'Get all publications'
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
        title: { type: 'string' },
        image_url: { type: 'string' },
        author_id: { type: 'number' },
        date_creation: { type: 'string' },
        date_creation_fr: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            display_name: { type: 'string' },
            profile_image_url: { type: 'string' }
          }
        },
        _count: { comment: { type: 'number' } }
      }
    }
  }
}

const schema = { ...documentation, response, params }
