const puppeteer = require('puppeteer')
const sessionFactory = require('../factories/sessionFactory')

class CustomPage {
  static async build() {
    //it will generate a new puppeteer page, then create a new instance of custom page and then combine them both together with a Proxy object and then return that

    const browser = await puppeteer.launch({
      //headless: false,
      headless: true,
      args: ['--no-sandbox'],
    })

    const page = await browser.newPage()
    const customPage = new CustomPage(page)

    //this will combine access to our custom page, our page and in this case will we also include browser in this proxy
    return new Proxy(customPage, {
      get: function (target, property) {
        //first look at custom page if that property has been defined on it, then we will lokk at page and then at browser
        return customPage[property] || browser[property] || page[property]
      },
    })
  }

  constructor(page) {
    //so whenever we create a new instance of customPage, we will save it's refernce to this.page
    this.page = page
  }

  async login() {
    const id = '61cd900c71cd0bb7848dc9e2'

    //const user = await userFactory()

    const { session, sig } = sessionFactory(id)

    await this.page.setCookie({ name: 'session', value: session })
    await this.page.setCookie({ name: 'session.sig', value: sig })
    //await this.page.goto('localhost:3000/blogs')
    await this.page.goto('http://localhost:3000/blogs')

    await this.page.waitFor('a[href="/auth/logout"]')
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML)
  }
}

module.exports = CustomPage
