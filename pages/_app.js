import PropTypes from 'prop-types';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import "../styles/global.scss";
import Layout from '~/components/Layout';
import { usePreserveScroll } from '~/utils';
import { I18n } from '~/context';
import RouteGuard from '~/components/RouteGuard';
import User from '~/components/User';
import LoginPage from '~/components/pages/LogInPage';


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

if (typeof window !== 'undefined') {
  window.lodash = () => {
    throw Error('lodash');
  };

  window._ = () => {
    throw Error('lodash2');
  }
}

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps: { ...pageProps }, router } = props;
  usePreserveScroll();
  const { locale } = router;
  const { pageParams } = pageProps;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Alioks Inc</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          autoHideDuration={2000}
        >
          <I18n.Provider value={{ myname: 'serhii' }}>
            {User.userIsLoggedIn()
              ?
              <Layout {...pageParams} _i18n={{ locale }}>
                <RouteGuard>
                  <Component {...pageProps} _i18n={{ locale }} />
                </RouteGuard>
              </Layout>
              : <div>
                {User.userIsLoggedIn() === false &&
                  <LoginPage {...pageProps} _i18n={{ locale }} />
                }
              </div>
            }
          </I18n.Provider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider >

  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default appWithTranslation(MyApp);
