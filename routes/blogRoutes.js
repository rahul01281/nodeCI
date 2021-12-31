const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')

const Blog = mongoose.model('Blog')

const cleanCache = require('../middlewares/cleanCache')

module.exports = (app) => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    })

    res.send(blog)
  })

  app.get('/api/blogs', requireLogin, async (req, res) => {
    // const redis = require('redis')
    // const redisUrl = 'redis://127.0.0.1:6379'
    // const client = redis.createClient(redisUrl)
    // const util = require('util')
    // //promisifying the client.get funciton
    // client.get = util.promisify(client.get) //so now client.get can return a promise instead of using a callback

    // //do we have any cached data in redis related to this query

    // //if yes, then respond to the request right away
    // const cachedBlogs = await client.get(req.user.id)

    // if (cachedBlogs) {
    //   console.log('serving from cache')
    //   return res.send(JSON.parse(cachedBlogs))
    // }

    //if no, we need to respond to request and store the data in cache
    const blogs = await Blog.find({ _user: req.user.id }).cache({
      key: req.user.id,
    }) //if we add the .cache, only results from this query will be cached

    // console.log('serving from mongodb')
    res.send(blogs)

    // client.set(req.user.id, JSON.stringify(blogs))
  })

  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content } = req.body

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    })

    try {
      await blog.save()
      res.send(blog)
    } catch (err) {
      res.send(400, err)
    }
    // //we will delete all the data that is stored in redis associated with this particular user
    // clearHash(req.user.id)
  })
}
