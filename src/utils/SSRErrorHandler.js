import { createSSRErrorResponse } from '~/utils';

module.exports = async (properites) => {
  const { error, locModules = [], locale, props = {}, serverSideTranslations } = properites;
  const currentLocale = locale || props.locale || 'en';
  const translations = await serverSideTranslations(
    currentLocale,
    [
      'buttons',
      'sidebar',
      'errors',
      'successes',
      'infos',
      'warnings',
      ...locModules,
    ]
  );
  const withErrors = createSSRErrorResponse(error, currentLocale);

  return {
    ...withErrors,
    ...{
      props: {
        ...withErrors.props,
        ...translations,
      }
    },
  };
};
