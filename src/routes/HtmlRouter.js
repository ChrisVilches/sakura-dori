const BaseRouter = require('./BaseRouter')
const { setBaseUrl, setHtmlTitle, setCurrentPath, analytics } = require('../middlewares/htmlMiddleware')

class HtmlRouter extends BaseRouter {
  static applyMiddlewares (router) {
    // Pass Google Analytics key.
    router.use(analytics)

    // Set global title to be shown in HTML pages.
    router.use(setHtmlTitle)

    // To be able to highlight the current page in HTML.
    router.use(setCurrentPath)

    // Set base URL to be used inside <base>.
    router.use(setBaseUrl)
  }
}

module.exports = HtmlRouter
