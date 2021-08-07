"use strict"

module.exports = async function (fastify, opts) {
  fastify.get("/", async function(request, reply) {
    const allPublication = await fastify.prisma.publication.findMany({
      include: {
        user: true
      }
    })
    return allPublication
  })

  fastify.post("/", async function(request, reply) {
    const newUser = await fastify.prisma.publication.create({
      data: {
        title: request.body.title,
        image_url: request.body.imageUrl,
        author_id: request.body.authorId
      }
    })
    return newUser
  })
}