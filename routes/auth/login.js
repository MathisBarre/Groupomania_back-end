import { compareSync } from 'bcrypt'

export default async function (fastify) {
  fastify.route({
    method: 'POST',
    url: '/auth/login',
    schema: schema,
    handler: handler
  })

  async function handler (request, reply) {
    const { email, password } = request.body

    const user = await fastify.prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) throw fastify.httpErrors.unauthorized('User not found')

    const token = await reply.jwtSign({ role: user.role, userId: user.id })

    if (!compareSync(password, user.password)) throw fastify.httpErrors.unauthorized('Incorrect password')

    const returnedUser = {
      id: user.id,
      displayName: user.display_name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profile_image_url
    }

    reply
      .setCookie('token', token, {
        domain: 'localhost',
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: true
      })
      .setCookie('connectedUser', JSON.stringify(returnedUser), {
        domain: 'localhost',
        path: '/',
        secure: true,
        httpOnly: false,
        sameSite: true
      })
      .code(200)
      .send(returnedUser)
  }
}

const documentation = {
  tags: ['Authentification'],
  summary: 'Connect an user',
  description: 'Connect an user by adding http only jwt token cookie and connectedUser cookie'
}

const body = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' }
  }
}

const response = {
  200: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      displayName: { type: 'string' },
      email: { type: 'string' },
      role: { type: 'string' },
      profileImageUrl: { type: 'string' }
    }
  }
}

const schema = { ...documentation, body, response }
