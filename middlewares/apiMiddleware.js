const createError = require('http-errors');

module.exports = {
  jsonApplicationResponse: function(_req, res, next){
    res.type('application/json');
    next();
  },
  apiKeyAuth: (req, _res, next) => {
    const apiKey = process.env.API_KEY;
    if(typeof apiKey != 'string' || apiKey.length == 0){
      throw new Error('Security issue: API KEY must be defined. API endpoints cannot be accessed.');
    }
    if(req.headers['x-api-key'] === apiKey) return next();
    next(createError(401, 'Not allowed'));
  }
};
