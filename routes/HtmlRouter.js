const BaseRouter = require('./BaseRouter');
const express = require('express');
const app = express();
const { setBaseUrl, setHtmlTitle, setCurrentPath, basicAuth, analytics } = require('../middlewares/htmlMiddleware');

class HtmlRouter extends BaseRouter{
  static applyMiddlewares(router){
    // To prevent other users seeing this page in the local deployment.
    if(app.get('env') === 'development'){
      router.use(basicAuth);
    }

    // Pass Google Analytics key.
    router.use(analytics);

    // Set global title to be shown in HTML pages.
    router.use(setHtmlTitle);

    // To be able to highlight the current page in HTML.
    router.use(setCurrentPath);

    // Set base URL to be used inside <base>.
    router.use(setBaseUrl);
  }
}

module.exports = HtmlRouter;
