import dayjs from "dayjs"
import "dayjs/locale/fr"

export default async function (fastify, opts) {
  fastify.get("/publications", { preValidation: [fastify.authenticate] }, async function getAllPublications(request, reply) {
    let allPublication = await fastify.prisma.publication.findMany({
      orderBy: [
        { id: "desc" }
      ],
      include: {
        user: true,
        _count: {
          select: { comment: true },
        },
      }
    })

    allPublication = allPublication.map((publication) => {
      publication.date_creation_fr = dayjs(publication.date_creation).locale("fr").format("DD MMMM YYYY [à] HH:mm")
      return publication
    })

    return allPublication
  })

  fastify.post("/publications", { preValidation: [fastify.authenticate] }, async function createOnePublication(request, reply) {
    const newUser = await fastify.prisma.publication.create({
      data: {
        title: request.body.title,
        image_url: request.body.imageUrl,
        author_id: request.user.userId
      }
    })

    return newUser
  })
}