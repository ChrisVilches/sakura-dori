const BaseRouter = require('../BaseRouter');
const { jsonApplicationResponse, apiKeyAuth } = require('../../middlewares/apiMiddleware');

class HtmlRouter extends BaseRouter{
  static applyMiddlewares(router){
    // Always respond with 'Content-Type=application/json' in these endpoints.
    router.use(jsonApplicationResponse);

    // Protect all following endpoints with API KEY.
    router.use(apiKeyAuth);
  }
}

module.exports = HtmlRouter;
