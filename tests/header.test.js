//const puppeteer = require('puppeteer')

const sessionFactory = require('./factories/sessionFactory')
const userFactory = require('./factories/userFactory')

const CustomPage = require('./helpers/page')

// test('adds 2 numbers', () => {
//   const sum = 1 + 2

//   expect(sum).toEqual(3)
// })

// let browser, page

let page

beforeEach(async () => {
  // //this stuff below will be envoked before every test we run
  // browser = await puppeteer.launch({
  //   headless: false,
  // }) //represnts the running browser window that gets created

  //page = await browser.newPage() //creates a new page in the browser that we just created

  page = await CustomPage.build()
  //await page.goto('localhost:3000')
  await page.goto('http://localhost:3000')
})

afterEach(async () => {
  // //executed after each test is finished
  // await browser.close()

  await page.close()
})

test.skip('header has the correct text', async () => {
  //const text = await page.$eval('a.brand-logo', (el) => el.innerHTML)
  const text = await page.getContentsOf('a.brand-logo')
  expect(text).toEqual('Blogster')
})

test.skip('clicking login starts the oauth flow', async () => {
  await page.click('.right a')

  const url = await page.url() //get the current page url from chromium
  expect(url).toMatch(/accounts.google.com/)
})

test.skip('when signed in, shows log out button', async () => {
  // //existing user id in our database
  // const id = '61cd900c71cd0bb7848dc9e2'

  // // const user = await userFactory()

  // const { session, sig } = sessionFactory(id)

  // // const buffer = require('safe-buffer').Buffer
  // // const sessionObject = {
  // //   passport: {
  // //     user: id,
  // //   },
  // // }

  // // const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
  // //   'base64'
  // // ) //converts the sessionObject to base64 string, will give a result like this: "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjFjZDkwMGM3MWNkMGJiNzg0OGRjOWUyIn19"

  // // //we have to provide both session string and signature otherwise the app will think it is an invalid session
  // // const Keygrip = require('keygrip')
  // // const keys = require('../config/keys')
  // // const keygrip = new Keygrip([keys.cookieKey])
  // // const sig = keygrip.sign('session=' + sessionString) //will give a result like this: "Os4TIh5RwgbYcWikboqycyPMrpc"

  // await page.setCookie({ name: 'session', value: session })
  // await page.setCookie({ name: 'session.sig', value: sig })
  // await page.goto('localhost:3000')

  // await page.waitFor('a[href="/auth/logout"]')

  await page.login()

  // const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML)
  const text = await page.getContentsOf('a[href="/auth/logout"]')
  expect(text).toEqual('Logout')
})
