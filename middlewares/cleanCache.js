const { clearHash } = require('../services/cache')

module.exports = async (req, res, next) => {
  //anytime we make use of middleware, the assumption is always that the middleware is going to run before the request handler, but if we think here, we dont want to dump our cache until after the post has been created.

  //what this does is it make sure that we call the next function, which in this case the route handler and we let the route handler do everything it needs to do. And after the route handler is complete, execution will come back to this middlweare right here and then we will do our work which is to call "clearHash" and pass in req.user.id
  await next()

  clearHash(req.user.id)
}
