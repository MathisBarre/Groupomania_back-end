import path from "path"
import AutoLoad from "fastify-autoload"

export default async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(require("fastify-cors"), {
    origin: true,
    credentials: true
  })

  fastify.register(require("fastify-cookie"))

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts)
  })
}
