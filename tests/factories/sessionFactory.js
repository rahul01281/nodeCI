const buffer = require('safe-buffer').Buffer
const Keygrip = require('keygrip')
const keys = require('../../config/keys')
const keygrip = new Keygrip([keys.cookieKey])

module.exports = (id) => {
  //   const sessionObject = {
  //     passport: {
  //       user: user._id.toString(),
  //     },
  //   }

  const sessionObject = {
    passport: {
      user: id,
    },
  }

  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64') //converts the sessionObject to base64 string, will give a result like this: "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjFjZDkwMGM3MWNkMGJiNzg0OGRjOWUyIn19"

  //we have to provide both session string and signature otherwise the app will think it is an invalid session

  const sig = keygrip.sign('session=' + session) //will give a result like this: "Os4TIh5RwgbYcWikboqycyPMrpc"

  return { session, sig }
}
