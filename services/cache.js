const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const keys = require('../config/keys')

//const redisUrl = 'redis://127.0.0.1:6379'
//const client = redis.createClient(redisUrl)
const client = redis.createClient(keys.redisUrl)

// client.get = util.promisify(client.get)
client.hget = util.promisify(client.hget) //promisifying the client.hget funciton. so now client.hget can return a promise instead of using a callback

const exec = mongoose.Query.prototype.exec //this stores the reference to the original exec funtion

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true
  this.hashKey = JSON.stringify(options.key || '') //cache key to use for top level key in nested caching

  return this
}

//anytime any query is issued inside of our application, the exec function will always run, which means now every query is being cached

//here now we can put some extra logic before this query is sent off to mongodb.

//"this" here is a reference to the current query that we are trying to execute. So whenever we run our mongoose query, this stuff below inside the function will be run
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments)
  }

  //   console.log('about to run a query')
  //   console.log(this.getQuery())
  //   console.log(this.mongooseCollection.name)
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name, //this tells the name of the collection from which we are extracting our records
    })
  )
  //   console.log(key) //result will be like { _user: '61cd900c71cd0bb7848dc9e2', collection: 'blogs' }

  //see if we have a value for 'key' in redis
  // const cacheValue = await client.get(key)
  const cacheValue = await client.hget(this.hashKey, key)

  //if we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue)

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc) //this.model is a reference to the model that represents this query
  }

  //otherwise issue the query and store the result in redis
  const result = await exec.apply(this, arguments) //the exec function expects us to return mongoose documents or what we refer to model instances

  //client.set(key, JSON.stringify(result), 'EX', 10)
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10)

  return result
}

module.exports = {
  clearHash(hashKey) {
    //delete all the cache stored in redis of some id
    client.del(JSON.stringify(hashKey))
  },
}
