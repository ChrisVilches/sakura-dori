const moment = require('moment');

module.exports = {
  limitDateFrom: (req, res, next) => {
    const daysAgo = Number(process.env.LIMIT_DATE_FROM_DAYS_AGO);
    if (typeof daysAgo != 'number' || !(daysAgo > 0)) {
      throw new Error(`Env variable LIMIT_DATE_FROM_DAYS_AGO is not set correctly. Value is ${process.env.LIMIT_DATE_FROM_DAYS_AGO}.`);
    }

    // TODO: Either this, or the frontend is bugged. Limit doesn't work
    // http://localhost:3000/?dateFrom=2021-09-15&dateTo=2021-09-23&chatId=1X43oeZOnwo&author=&text=
    // Old comments by たまご。 are displayed.
    let date = moment().subtract(daysAgo, 'days');

    if (moment(req.query.dateFrom).isBefore(date)) {
      req.query.dateFrom = date;
    }

    date = date.format("YYYY-MM-DD");
    res.locals.limitDateFrom = date;

    next();
  }
}
