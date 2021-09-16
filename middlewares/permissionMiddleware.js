const moment = require('moment');

module.exports = {
  limitDateFrom: (req, res, next) => {
    const daysAgo = Number(process.env.LIMIT_DATE_FROM_DAYS_AGO);
    if (typeof daysAgo != 'number' || daysAgo < 1) {
      throw new Error(`Env variable LIMIT_DATE_FROM_DAYS_AGO is not set correctly. Value is ${process.env.LIMIT_DATE_FROM_DAYS_AGO}.`);
    }

    const date = moment().subtract(daysAgo, 'days').format("YYYY-MM-DD");
    res.locals.limitDateFrom = true;
    req.query.dateFrom = date;

    next();
  }
}
