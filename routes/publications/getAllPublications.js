import dayjs from 'dayjs'

export default async function(fastify) {
  fastify.route({
    method: "GET",
    url: "/publications",
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler(request, reply) {
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
      publication.date_creation_fr = dayjs(publication.date_creation).format("DD MMMM YYYY [à] HH:mm")
      return publication
    })

    return allPublication
  }
}