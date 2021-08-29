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
  basicAuth: basicAuth({
    challenge: true,
    users: { admin: 'supersecret' }
  }),
  analytics: (_req, res, next) => {
    const key = (process.env.GOOGLE_ANALYTICS_KEY || '').trim();
    res.locals.analyticsKey = key;
    res.locals.useAnalytics = key.length > 0;
    next();
  }
};
