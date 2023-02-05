const EmojiSet = require('emoji-set');
const R = require('ramda');
const moment = require('moment-timezone');
const fs = require('fs');

const YOUTUBE_ICONS = new Set(
  fs.readdirSync("./src/assets/images/youtube-icons")
    .filter(file => file.endsWith('.png'))
    .map(file => file.replace(/\.png$/, ''))
);

// Map emojicode -> emoji,
// e.g. tomato -> 🍅
const EMOJI_CONVERSION = Object.entries(EmojiSet.getAll())
  .reduce((prev, [emoji, data]) => ({ ...prev, ...{ [data.code]: emoji } }), {});

const ALLOWED_QUERY_VALUE_TYPES = Object.freeze(['boolean', 'number', 'string']);

const formatDate = date => {
  let format = 'YYYY/MM/DD HH:mm';
  if (moment(date).isSame(new Date(), 'year')) format = 'M月D日 HH:mm';
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

const EMOJI_REGEX_SINGLE = /^(:[a-z_-]+:)$/;
const COLON_REGEX = /:/g;

const isEmoji = text => Boolean(text.match(EMOJI_REGEX_SINGLE));

const textSplitEmojis = text => text.split(/(:[a-z_-]+:)/g);

const removeColons = icon => icon.replace(COLON_REGEX, '');

const isYoutubeIcon = icon => YOUTUBE_ICONS.has(icon);

const toEmoji = iconName => {
  const result = EMOJI_CONVERSION[iconName];
  if (!result) {
    // TODO: This is mostly to monitor the emoji upgrade, since the code may not be
    //       stable at first. Remove this comment in the future.
    //       There could be some rare cases where the icons in a message are not parsed correctly,
    //       so be sure to monitor it a bit.
    //       I think the best way to unit test this would be to make the split function return a list of
    //       structs that have an enum flag (3 options: normal text, normal emoji, youtube icon),
    //       that way it's easier to write the template code (pug) and also to unit test.
    console.error(`Attempted to convert emoji ${iconName} but it wasn't found`);
  }
  return result;
}

const translateEnvironment = env => {
  if (env == 'development') return '開発環境';
  if (env == 'production') return '本番サイト';
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
  toEmoji,
  textSplitEmojis,
  isEmoji,
  isYoutubeIcon,
  removeColons
};
