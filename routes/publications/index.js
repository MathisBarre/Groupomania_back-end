"use strict"

const dayjs = require("dayjs")
require("dayjs/locale/fr")

module.exports = async function (fastify, opts) {
  fastify.get("/" , async function(request, reply) {
    console.log(request.user)
    let allPublication = await fastify.prisma.publication.findMany({
      orderBy: [
        { id: "desc" }
      ],
      include: {
        user: true
      }
    })

    allPublication = allPublication.map((publication) => {
      publication.date_creation_fr = dayjs(publication.date_creation).locale("fr").format("DD MMMM YYYY [à] HH:mm")
      return publication
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