import dayjs from 'dayjs'

export default async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/users',
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
