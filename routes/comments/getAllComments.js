import dayjs from 'dayjs'

export default async function(fastify) {
  fastify.route({
    method: "GET",
    url: "/comments/:publicationId",
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler(request, reply) {
    let allCommentsFromOnePublication = await fastify.prisma.comment.findMany({
      where : {
        publication_id: parseInt(request.params.publicationId, 10)
      },
      select: {
        id: true,
        content: true,
        publication_id: true,
        author_id: true,
        user: {
          select: {
            display_name: true,
            profile_image_url: true,
          }
        }
      },
      orderBy: [
        { id: "asc" }
      ],
    })

    allCommentsFromOnePublication = allCommentsFromOnePublication.map((comment) => {
      comment.date_creation_fr = dayjs(comment.date_creation).format("DD MMMM YYYY [à] HH:mm")
      return comment
    })

    return allCommentsFromOnePublication
  }
}