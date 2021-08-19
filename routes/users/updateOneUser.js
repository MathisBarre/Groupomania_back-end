export default async function (fastify) {
  fastify.route({
    method: 'PATCH',
    url: '/users',
    preValidation: [fastify.authenticate],
    handler: handler
  })

  async function handler (request) {
    const { userId } = fastify.jwt.decode(request.cookies.token)
    const { email, display_name: displayName, profile_image_url: profileImageUrl } = request.body

    const updatedUser = await fastify.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        email: email,
        display_name: displayName,
        profile_image_url: profileImageUrl
      }
    })

    console.log(updatedUser)

    return { message: 'Update succeed' }
  }
}
