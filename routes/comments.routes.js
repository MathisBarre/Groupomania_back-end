import dayjs from "dayjs"
import "dayjs/locale/fr"

export default async function (fastify, opts) {
  fastify.get("/comments/:publicationId", { preValidation: [fastify.authenticate] }, async function getAllCommentsFromOnePublication(request, reply) {
    
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
      comment.date_creation_fr = dayjs(comment.date_creation).locale("fr").format("DD MMMM YYYY [à] HH:mm")
      return comment
    })

    return allCommentsFromOnePublication
  })

  fastify.post("/comments", { preValidation: [fastify.authenticate] }, async function createOneComment(request, reply) {
    const newComment = await fastify.prisma.comment.create({
      data: {
        content: request.body.comment,
        publication_id: request.body.publicationId,
        author_id: fastify.jwt.decode(request.cookies.token).userId
      }
    })

    return newComment
  })
  }