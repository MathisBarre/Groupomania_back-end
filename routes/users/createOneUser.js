import { hashSync } from "bcrypt"

export default async function(fastify) {
  fastify.route({
    method: "POST",
    url: "/users",
    handler: handler
  })

  async function handler(request, reply) {
    const { email, display_name, password } = request.body

    const saltRounds = 10;
    const hash = hashSync(password, saltRounds);

    const newUser = await fastify.prisma.user.create({
      data: {
        email: email,
        display_name: display_name,
        password: hash
      }
    })

    const token = await reply.jwtSign({ role: newUser.role, userId: newUser.id })

    const returnedUser = {
      id: newUser.id,
      displayName: newUser.display_name,
      email: newUser.email,
      role: newUser.role,
      profileImageUrl: newUser.profile_image_url
    }

    reply
      .setCookie("token", token, {
        domain: "localhost",
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: true
      })
      .setCookie("connectedUser", JSON.stringify(returnedUser), {
        domain: "localhost",
        path: "/",
        secure: true,
        httpOnly: false,
        sameSite: true
      })
      .code(200)
      .send(returnedUser)
  }
}