const createError = require('http-errors')

// Set default values for errors.
const setDefaultErrorValues = (err, req, _res, next) => {
  // Default to true only for non Internal Server Errors.
  if (!('expose' in err)) {
    err.expose = err.status < 500
  }

  // Not sure about this one. This might be confusing as to why the message
  // is showing even if 'expose' was set to false. But this only happens in development.
  if (req.app.get('env') === 'development') {
    err.expose = true
  }

  err.status = err.status || 500
  next(err)
}

// Render response for errors.
const renderError = (err, req, res, _next) => {
  res.locals.error = err
  res.locals.showTrace = req.app.get('env') === 'development'

  err.message = err.expose ? err.message : '不明なエラーが発生しました。'

  res.status(err.status)

  const isJsonResponse = (res.getHeaders()['content-type'] || '').includes('application/json')

  if (isJsonResponse) {
    const response = { error: err.message }
    if (res.locals.showTrace) response.stack = err.stack.split('\n')
    res.json(response)
  } else {
    res.render('error')
  }
}

module.exports = {
  matchUnknownRoute: (_req, _res, next) => {
    next(createError(404, '見つかりませんでした…(´・ω・｀)'))
  },
  handleErrors: [setDefaultErrorValues, renderError]
}
