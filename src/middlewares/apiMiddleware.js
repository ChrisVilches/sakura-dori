const createError = require('http-errors')

module.exports = {
  jsonApplicationResponse: function (_req, res, next) {
    res.type('application/json')
    next()
  },
  apiKeyAuth: (req, _res, next) => {
    if (req.headers['x-api-key'] === process.env.API_KEY) return next()
    next(createError(401, 'Not allowed'))
  }
}
