module.exports = {
  config: () => {
    require('dotenv').config();
    const moment = require('moment-timezone');
    const setTZ = require('set-tz');
    const TIMEZONE = 'Asia/Tokyo';
    const LOCALE = 'ja';

    setTZ(TIMEZONE);
    moment.locale(LOCALE);
    moment.tz.setDefault(TIMEZONE);
  }
};
