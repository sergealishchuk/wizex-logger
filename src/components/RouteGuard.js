import { useRouter } from 'next/router';
import { needsAuthRoute, isBrowser } from "~/utils";
import User from '~/components/User';
import Observer from "~/utils/observer";
import { useEffect, useState } from 'react';

const RouteGuard = (props) => {
  const { children } = props;

  // if (!isBrowser()) {
  //   return children;
  // }

  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const authCheck = () => {
      const userLoged = User.isLog();
      const currentRoute = router.asPath.split('?')[0];

      // if (!userLoged && currentRoute !== '/login') {
      //   setAuthorized(false);
      //   //router.push('/login');
      //   //Observer.send('OpenSignInDialog');
      // } else {
      //   setAuthorized(true);
      // }
      if (!userLoged && needsAuthRoute(currentRoute)) {
        setAuthorized(false);
        Observer.send('OpenSignInDialog');
      } else {
        setAuthorized(true);
      }
    };

    authCheck();

    const preventAccess = () => setAuthorized(false);

    router.events.on('routeChangeStart', preventAccess);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', preventAccess);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [router, router.events]);

  return authorized ? (
    children
  ) : null;
};

export default RouteGuard;
