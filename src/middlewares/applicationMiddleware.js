const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const camelcaseKeys = require('camelcase-keys');

// Execute next(err) automatically when an exception is thrown inside routes.
// This prevents having to write try { ... } catch(e) { next(e) } in all routes.
// If a runtime exception is thrown, it will respond with 500. Custom errors
// can still be used if desired.
require('express-async-errors');

const requestToCamelCase = (req, _res, next) => {
  req.body = camelcaseKeys(req.body, { deep: true });
  req.params = camelcaseKeys(req.params);
  req.query = camelcaseKeys(req.query);
  next();
};

module.exports = [
  logger('dev'),
  express.json({ limit: '50mb', extended: true }),
  express.urlencoded({ limit: '50mb', extended: true }),
  cookieParser(),
  express.static(path.join(require('path').resolve('./'), 'dist')),
  requestToCamelCase
];
