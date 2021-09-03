require('./appConfig').config();
const express = require('express');
const path = require('path');
const indexHelpers = require('./helpers/index_helpers');
const applicationMiddleware = require('./middlewares/applicationMiddleware');
const { syncAllModels } = require('./dbconnection');
const { matchUnknownRoute, handleErrors } = require('./middlewares/errorMiddleware');

(async function(){
  await syncAllModels();
  // Connect to DB by executing a query at service startup.
  const ReportService = require('./services/ReportService');
  const reportService = new ReportService();
  const count = await reportService.countAll();
  console.log(`Currently ${count} messages in the database.`);
})();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser, camelcase requests, etc.
app.use(applicationMiddleware);

// NOTE: When adding routes, add them from specific to generic, otherwise
//       some routes may conflict.
//
//       Example:
//       Assume '/api' is before '/api/report', therefore when accessing the route '/api/report/something'
//       it would raise 404 because it's not found in '/api' routes. The error happens because it checks
//       '/api' and decides the route doesn't exist, without checking '/api/report'.
app.use('/api/report', require('./routes/api/report'), matchUnknownRoute);
app.use('/api', require('./routes/api/scrape'), matchUnknownRoute);
app.use('/', require('./routes/index'), matchUnknownRoute);

// Handle errors.
app.use(handleErrors);

// Pass some helpers to templates.
app.locals.helpers = indexHelpers;

module.exports = app;
