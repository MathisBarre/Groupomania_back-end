import path, { dirname } from "path"
import { fileURLToPath } from "url"
import AutoLoad from "fastify-autoload"
import fastifyCors from "fastify-cors"
import fastifyCookie from "fastify-cookie"

export default async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(fastifyCors, {
    origin: true,
    credentials: true
  })

  fastify.register(fastifyCookie)

  // Do not touch the following lines
  const __dirname = dirname(fileURLToPath(import.meta.url));
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
