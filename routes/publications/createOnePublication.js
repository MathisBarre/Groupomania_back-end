export default async function(fastify) {
  fastify.route({
    method: "POST",
    url: "/publications",
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler(request, reply) {
    const newUser = await fastify.prisma.publication.create({
      data: {
        title: request.body.title,
        image_url: request.body.imageUrl,
        author_id: request.user.userId
      }
    })

    return newUser
  }
}