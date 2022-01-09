jest.setTimeout(30000)

require('../models/User')
const mongoose = require('mongoose')
const keys = require('../config/keys')

mongoose.Promise = global.Promise //telling mongoose to make use of nodejs global promise object
mongoose.connect(keys.mongoURI, { useMongoClient: true })
