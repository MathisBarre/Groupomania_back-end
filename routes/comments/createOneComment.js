export default async function(fastify) {
  fastify.route({
    method: "POST",
    url: "/comments",
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler(request, reply) {
    const newComment = await fastify.prisma.comment.create({
      data: {
        content: request.body.comment,
        publication_id: request.body.publicationId,
        author_id: fastify.jwt.decode(request.cookies.token).userId
      }
    })

    return newComment
  }
}