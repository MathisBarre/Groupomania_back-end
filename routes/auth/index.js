"use strict"

const bcrypt = require("bcrypt")

module.exports = async function (fastify, opts) {
  fastify.post("/login", async function(request, reply) {
      const { email, password } = request.body

      const user = await fastify.prisma.user.findUnique({
        where: {
          email: email,
        }
      })

      if (!user) throw fastify.httpErrors.unauthorized("User not found")

      const token = await reply.jwtSign({ role: user.role })
    
      if (!bcrypt.compareSync(password, user.password)) throw fastify.httpErrors.unauthorized("Incorrect password")

      reply
        .setCookie("token", token, {
          domain: "localhost",
          path: "/",
          secure: true, // send cookie over HTTPS only
          httpOnly: true,
          sameSite: true // alternative CSRF protection
        })
        .setCookie("connectedUser", JSON.stringify({
          displayName: user.display_name,
          email: user.email,
          role: user.role,
          profileImageUrl: user.profile_image_url
        }), {
          domain: "localhost",
          path: "/",
          secure: true, // send cookie over HTTPS only
          httpOnly: false,
          sameSite: true // alternative CSRF protection
        })
        .code(200)
        .send({
          displayName: user.display_name,
          email: user.email,
          role: user.role,
          profileImageUrl: user.profile_image_url
        })
  })

  fastify.post("/logout", async function(request, reply) {
    reply.clearCookie('token', {
      domain: "localhost",
      path: "/",
      secure: true, // send cookie over HTTPS only
      httpOnly: true,
      sameSite: true // alternative CSRF protection
    }).code(200).send({ message: "User disconnected"})
  })
}