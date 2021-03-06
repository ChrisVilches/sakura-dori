const EmojiSet = require('emoji-set');
const R = require('ramda');
const moment = require('moment-timezone');

// Map emojicode -> emoji,
// e.g. tomato -> ð
const EMOJI_CONVERSION = Object.entries(EmojiSet.getAll())
  .reduce((prev, [emoji, data]) => ({ ...prev, ...{ [data.code]: emoji } }), {});

const ALLOWED_QUERY_VALUE_TYPES = Object.freeze(['boolean', 'number', 'string']);

const formatDate = date => {
  let format = 'YYYY/MM/DD HH:mm';
  if (moment(date).isSame(new Date(), 'year')) format = 'MæDæ¥ HH:mm';
  return moment(date).format(format);
}

const formatDateDetail = date => {
  return moment(date).format();
}

const formatDateAgo = date => moment(date).fromNow();

const secToMin = seconds => Math.round(seconds / 60);

const isOlderThanDays = (date, days) => {
  return moment().diff(date, 'days') > days;
}

const toQueryString = (...objects) => {
  const params = R.mergeAll(objects);
  const keys = Object.keys(params);
  return keys.map(k => [k, params[k]])
    .filter(([_key, value]) => ALLOWED_QUERY_VALUE_TYPES.includes(typeof value))
    .filter(([_key, value]) => String(value).length > 0)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

const numberFormat = n => n.toLocaleString();

const joinTitle = (title, subtitle) => subtitle ? `${title} | ${subtitle}` : title;

const youtubeLink = chatId => `https://www.youtube.com/watch?v=${chatId}`;

const formatCommit = R.take(7);

const EMOJI_REGEX = new RegExp(':([a-z_]+):', 'g');

const convertEmojis = text => {
  return text.replace(EMOJI_REGEX, (match, capture) => EMOJI_CONVERSION[capture] || match);
}

const translateEnvironment = env => {
  if (env == 'development') return 'éçºç°å¢';
  if (env == 'production') return 'æ¬çªãµã€ã';
  return env;
}

module.exports = {
  formatDate,
  formatDateDetail,
  numberFormat,
  joinTitle,
  formatDateAgo,
  youtubeLink,
  formatCommit,
  toQueryString,
  isOlderThanDays,
  secToMin,
  translateEnvironment,
  convertEmojis
};
