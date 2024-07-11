import { i18n } from "next-i18next";
/*
  Example:
  1.
  import { translateByCode } from '~/utils';
  const err = translateByCode('ALREADY_CANCELED');

  2.
  import { translateByCode } from '~/utils';
  const suc = translateByCode('SUCCESS_ADDED', {
      ns: 'success',
      params: {
        recordCount: 4,
      }
    });
*/
export default (code, options = {}) => {
  if (i18n === null) {
    return code;
  }

  const { params = {}, ns = 'errors', t = i18n.t, locale = 'en'} = options;
  i18n && i18n.changeLanguage(locale)
  let message = t(code, { ns });

  const keys = Object.keys(params);
  if (keys.length > 0) {
    const regex = new RegExp('\\$\\{(' + keys.join('|') + ')\\}', 'g');
    message = message.replace(regex, (m, $1) => params[$1] || m);
  }

  return message;
};
