"use strict"

const bcrypt = require("bcrypt")
const dayjs = require("dayjs")
require("dayjs/locale/fr")

module.exports = async function (fastify, opts) {
  fastify.get("/", async function getAllUsers(request, reply) {
    let users = await fastify.prisma.user.findMany()

    users = users.map((user) => {
      user.date_creation_fr = dayjs(user.date_creation).locale("fr").format("DD MMMM YYYY - HH:mm")
      return user
    })

    return users
  })

  fastify.post("/", async function createOneUser(request, reply) {
    const { email, display_name, password } = request.body

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const newUser = await fastify.prisma.user.create({
      data: {
        email: email,
        display_name: display_name,
        password: hash
      }
    })

    const token = await reply.jwtSign({ role: newUser.role, userId: newUser.id })

    reply
      .setCookie("token", token, {
        domain: "localhost",
        path: "/",
        secure: true, // send cookie over HTTPS only
        httpOnly: true,
        sameSite: true // alternative CSRF protection
      })
      .setCookie("connectedUser", JSON.stringify({
        displayName: newUser.display_name,
        email: newUser.email,
        role: newUser.role,
        profileImageUrl: newUser.profile_image_url
      }), {
        domain: "localhost",
        path: "/",
        secure: true, // send cookie over HTTPS only
        httpOnly: false,
        sameSite: true // alternative CSRF protection
      })
      .code(200)
      .send({
        displayName: newUser.display_name,
        email: newUser.email,
        role: newUser.role,
        profileImageUrl: newUser.profile_image_url
      })
  })
}