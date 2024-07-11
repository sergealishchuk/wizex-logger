import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import Fade from '@mui/material/Fade';
import { Observer, changeLocale, _ } from '~/utils';
import User from "~/components/User";
import { userService, goodsService } from '~/http/services';
import Header from '../Header';
import Footer from '../Footer';
import Spinner from '~/components/Spinner';
import ScreenShadow from "~/components/ScreenShadow";
import Breadcrumbs from "../Breadcrumbs";
import ErrorPage from "../ErrorPage";
import { ConfirmDialog, ConfirmLeavePageDialog } from '~/components/Dialog';
import { getNotificationToken } from '~/components/Firebase';
import { userSocketService } from "~/socket/services";
import { FlexContainer } from "../StyledComponents";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'next-i18next';
import 'highlight.js/styles/github.css';

export default function Layout({ children, error, ...rest }) {
  const router = useRouter();
  const [pos, setPos] = useState(false);
  const [spinnerShow, setSpinnerShow] = useState(false);
  const [screenShadowShow, setScreenShadowShow] = useState(false);
  const [userProfileLoaded, setUserProfileLoaded] = useState(false);
  const [readyToUse, setReadyToUse] = useState(true);
  const [userIsLogged, setUserIsLogged] = useState();
  const [documentVisible, setDocumentVisible] = useState(true);
  const [sellerLocked, setSellerLocked] = useState(false);
  const [offSellerLocked, setOffSellerLocked] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(router.locale);
  const [scrolledUp, setScrolledUp] = useState(false);

  const { t } = useTranslation(['sidebar', 'buttons', 'errors', 'warnings']);

  const {
    withoutHeader,
    withoutFooter,
    withScrollUpButton,
    withoutBreadcrumbs,
    bcProps,
  } = rest;

  useEffect(() => {
    if (!_.isUndefined(userIsLogged)) {
      if (!userIsLogged || (userIsLogged && userProfileLoaded)) {
        setReadyToUse(true);
        changeLocale(currentLocale, router);
      }
    }
  }, [userIsLogged, userProfileLoaded]);

  useEffect(() => {
    const userLogged = User.isLog();
    if (!userLogged) {
      router.push('/login', null, {locale: 'en'});
    }
    router.events.on('routeChangeStart', () => setSpinnerShow(true));
    router.events.on('routeChangeComplete', () => setSpinnerShow(false));
    router.events.on('routeChangeError', () => setSpinnerShow(false));

    window.addEventListener("scroll", handleScroll);
    const upSpinnerShow = Observer.addListener('SpinnerShow', (up) => {
      setSpinnerShow(up);
    });

    const upScreenShadowShow = Observer.addListener('ScreenShadowShow', (up) => {
      setScreenShadowShow(up);
    });

    setUserIsLogged(userLogged);

    if (userLogged) {
      userService.getUserProfile()
        .then(response => {
          const { user } = response;
          if (!_.isEmpty(user)) {
            const { email, firstname, lastname, phone, locked, currencyCodeBuyer, roles, locale } = user;
            const userInfo = {
              email,
              firstname,
              lastname,
              name: `${firstname} ${lastname}`,
              phone,
              locked,
              roles,
              locale,
            };
            User.updateUserInfo(userInfo);
            setUserProfileLoaded(true);
            setSellerLocked(locked);
            setCurrentLocale(locale);
            Observer.send('onUserProfileLoaded', userInfo)
          }
        });

      try {
        if (userLogged && getNotificationToken && _.isFunction(getNotificationToken)) {
          getNotificationToken()
            .then(token => {
              userService.updateNotifyToken({ token })
                .then(response => {
                  //const { user } = response;
                  //console.log('notify response: ', response);
                })
                .catch(error => console.log('err1:', error));
            })
            .catch(error => console.log('err2:', error));
        }
      } catch (error) {
        console.log('err3', error);
      }
    }

    const handleDocumentVisible = async () => {
      const visible = document.visibilityState === "visible";
      if (visible) {
        Observer.send('onStatusesUpdateForce');
      }

      await userSocketService.visible({ visible });
      setDocumentVisible(visible);
    };

    document.addEventListener("visibilitychange", handleDocumentVisible);

    return () => {
      Observer.removeListener(upSpinnerShow);
      Observer.removeListener(upScreenShadowShow);
      if (typeof (window) !== 'undefined') {
        window.removeEventListener("scroll", handleScroll);
      }
      typeof (document) !== 'undefined' && document.removeEventListener("visibilitychange", handleDocumentVisible);
    }

  }, []);

  const handleTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setPos(false);
  };

  const handleScroll = () => {
    setPos(window.scrollY > 200);

    if (window.scrollY >= 124) {
      setScrolledUp(true);
      Observer.send('onWindowScrolledUp', true);
    } else if (window.scrollY < 124) {
      setScrolledUp(false);
      Observer.send('onWindowScrolledUp', false);
    }
  };

  const handleCloseBlockedBanner = () => {
    setOffSellerLocked(true);
  };

  if (typeof Wizex !== 'undefined') {
    Wizex.log('hello my frend');
  }

  return readyToUse && ( // TODO: need to remove, ONLY FOR DEV MODE !!!!!!!!!!!!
    <>
      {!withoutHeader && <Header />}
      <motion.div key={router.route} style={{ maxWidth: '1195px', margin: 'auto' }} initial="pageInitial" animate="pageAnimate" variants={{
        pageInitial: {
          opacity: 0
        },
        pageAnimate: {
          opacity: 1
        },
      }}>
        <div className={
          classNames(
            "content",
            {
              'no-header': withoutHeader
            }
          )}
        >
          {
            userIsLogged && sellerLocked && !offSellerLocked && (
              <div style={{ backgroundColor: '#b70000', color: 'white', padding: '6px', fontSize: '10px', marginBottom: '4px' }}>
                <FlexContainer jc="space-between">
                  <div>Your account as Seller has been blocked</div>
                  <Tooltip title={t('close', { ns: 'buttons' })}>
                    <span>
                      <IconButton style={{ padding: '2px' }} onClick={handleCloseBlockedBanner}>
                        <CloseIcon style={{ fontSize: '17px', color: 'white' }} />
                      </IconButton>
                    </span>
                  </Tooltip>

                </FlexContainer>
              </div>
            )
          }
          {!error && !withoutBreadcrumbs && (
            <div style={{ zIndex: 9, marginLeft: '0', marginBottom: '16px', height: '25px', minHeight: '25px' }}>
              <Breadcrumbs route={router.route} bcProps={bcProps} />
            </div>
          )}
          <div className="main-content">
            {
              !error ? readyToUse && children : <ErrorPage {...error} />
            }
            {!withoutFooter && <Footer />}
          </div>

          {withScrollUpButton && (
            <Fade in={pos} timeout={1000}>
              <KeyboardDoubleArrowUpIcon
                style={{
                  position: "fixed",
                  bottom: '13px',
                  right: '30px',
                  fontSize: 38,
                  backgroundColor: '#0325bf3d',
                  borderRadius: 19,
                  color: 'white',
                }}
                onClick={handleTop}
              />
            </Fade>)
          }
        </div>
      </motion.div>
      <Spinner show={spinnerShow} />
      <ScreenShadow show={screenShadowShow} />
      <ConfirmLeavePageDialog />
      <ConfirmDialog />
    </>
  )
};
