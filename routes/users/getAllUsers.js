import dayjs from 'dayjs'

export default async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/users',
    schema: schema,
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler () {
    let users = await fastify.prisma.user.findMany()

    users = users.map((user) => {
      user.date_creation_fr = dayjs(user.date_creation).format('DD MMMM YYYY - HH:mm')
      return user
    })

    return users
  }
}

const documentation = {
  tags: ['Users'],
  summary: 'Get all users',
  description: 'Get all users'
}

const response = {
  200: {
    type: 'array',
    items: {
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
}

const schema = { ...documentation, response }
