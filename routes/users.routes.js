"use strict"

const bcrypt = require("bcrypt")
const dayjs = require("dayjs")
require("dayjs/locale/fr")

module.exports = async function (fastify, opts) {
  fastify.get("/users", { preValidation: [fastify.authenticate] }, async function getAllUsers(request, reply) {
    let users = await fastify.prisma.user.findMany()

    users = users.map((user) => {
      user.date_creation_fr = dayjs(user.date_creation).locale("fr").format("DD MMMM YYYY - HH:mm")
      return user
    })

    return users
  })

  fastify.get("/users/:userId", { preValidation: [fastify.authenticate] }, async function getOneUser(request, reply) {
    const requestUserId = parseInt(request.params.userId, 10)
    const trueUserId = parseInt(fastify.jwt.decode(request.cookies.token).userId, 10)

    if ( requestUserId !== trueUserId ) throw fastify.httpErrors.unauthorized()

    let user = await fastify.prisma.user.findUnique({
      where: {
        id: requestUserId
      }
    })

    return {
      displayName: user.display_name,
      email: user.email,
    }
  })

  fastify.post("/users", async function createOneUser(request, reply) {
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
        id: newUser.id,
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
        id: newUser.id,
        displayName: newUser.display_name,
        email: newUser.email,
        role: newUser.role,
        profileImageUrl: newUser.profile_image_url
      })
  })

  fastify.patch("/users", { preValidation: [fastify.authenticate] }, async function updateOneUser(request, reply) {
    const { userId } = fastify.jwt.decode(request.cookies.token)
    const { email, display_name, profile_image_url } = request.body

    const updatedUser = await fastify.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        email: email,
        display_name: display_name,
        profile_image_url: profile_image_url
      }
    })

    console.log(updatedUser)

    return { message: "Update succeed" }
  })
}