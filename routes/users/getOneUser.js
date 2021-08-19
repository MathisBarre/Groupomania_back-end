export default async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/users/:userId',
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
