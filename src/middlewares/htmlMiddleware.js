const basicAuth = require('express-basic-auth');

const TITLE = 'さくら通り';

module.exports = {
  setHtmlTitle: (_req, res, next) => {
    res.locals.title = TITLE;
    next();
  },
  setCurrentPath: (req, res, next) => {
    res.locals.currentPath = req.path;
    next();
  },
  setBaseUrl: (req, res, next) => {
    res.locals.baseUrl = process.env.BASE_URL;
    next();
  },
  basicAuth: basicAuth({
    challenge: true,
    users: { [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD }
  }),
  analytics: (_req, res, next) => {
    const key = (process.env.GOOGLE_ANALYTICS_KEY || '').trim();
    res.locals.analyticsKey = key;
    res.locals.useAnalytics = key.length > 0;
    next();
  }
};
