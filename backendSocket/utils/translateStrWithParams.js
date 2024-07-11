const locales = require('../locales');

module.exports = (str, options = {}) => {
  const { locale, params } = options;

  let message = str;

  message = locales[locale][str];

  const keys = Object.keys(params);
  if (keys.length > 0) {
     const regex = new RegExp('\\$\\{(' + keys.join('|') + ')\\}', 'g');
     message = message.replace(regex, (m, $1) => params[$1] || m);
  }

  return message;
};
