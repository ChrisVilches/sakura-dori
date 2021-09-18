const requireEnv = require('require-environment-variables');

const requireEnvVariables = () => {
  requireEnv([
    'DATABASE_URL',
    'ACTIVE_USERS_WITHIN_SECONDS',
    'ACTIVE_USERS_INTERVAL_SECONDS',
    'API_KEY',
    'PER_PAGE',
    'BASE_URL',
    'LIMIT_DATE_FROM_DAYS_AGO',
    'BASIC_AUTH_USERNAME',
    'BASIC_AUTH_PASSWORD'
  ]);
}

module.exports = {
  config: () => {
    require('dotenv').config();
    requireEnvVariables();
    const moment = require('moment-timezone');
    const setTZ = require('set-tz');
    const TIMEZONE = 'Asia/Tokyo';
    const LOCALE = 'ja';

    setTZ(TIMEZONE);
    moment.locale(LOCALE);
    moment.tz.setDefault(TIMEZONE);
  }
};
