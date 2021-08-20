import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import AutoLoad from 'fastify-autoload'
import fastifyCors from 'fastify-cors'
import fastifyCookie from 'fastify-cookie'
import fastifySwagger from 'fastify-swagger'
import fastifyEnv from 'fastify-env'

export default async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(fastifyCors, {
    origin: true,
    credentials: true
  })

  fastify.register(fastifyCookie)

  const envSchema = {
    type: 'object',
    required: ['JWT_SECRET_KEY'],
    properties: {
      JWT_SECRET_KEY: { type: 'string', default: '9a5Vx9zdc4eUv9b84tynDu8k4o2p5' }
    }
  }

  fastify.register(fastifyEnv, {
    schema: envSchema,
    dotenv: true,
    confKey: 'config'
  })

  fastify.register(fastifySwagger, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Groupomania Back-end',
        description: 'Documentation for the API of the Groupomania project created by Mathis Barré',
        version: '0.1.0'
      },
      host: 'localhost:3001',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'Authentification', description: 'Authentification endpoints' },
        { name: 'Users', description: 'Users CRUD' },
        { name: 'Publications', description: 'Publications CRUD' },
        { name: 'Comments', description: 'Comments CRUD' }
      ],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'token',
          in: 'cookie'
        }
      }
    },
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true
  })

  // Do not touch the following lines
  const __dirname = dirname(fileURLToPath(import.meta.url))
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts)
  })
}
