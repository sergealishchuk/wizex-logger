import { useEffect, useState } from "react";
import User from "~/components/User";
import Button from '@mui/material/Button';
import { AlertDialog } from '~/components/Dialog';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { needsAuthRoute } from "~/utils";
import SocketServer from "~/socket";
import { userService } from '~/http/services';
import { userSocketService } from "~/socket/services";

export default function LogoutAlert(props) {
  const { openConfirmLogOutAlert, setOpenConfirmLogOutAlert } = props;

  const [exitRoutePath, setExitRoutePath] = useState(); 
  const [startRoutePath, setStartRoutePath] = useState();
  const [logoutUser, setLogoutUser] = useState(false);
  const { t } = useTranslation(['sidebar', 'buttons']);
  const router = useRouter();

  const logoutRequest = async () => {
    const result = await userService.logout({
      logoutAllConnection: true,
    });
    try {
      await userSocketService.logoutUser({
        logoutAllConnection: true,
      });
    } catch (e) { }
    User.clear();
    SocketServer.disconnect();
    router.push('/');
  };

  useEffect(() => {
    const currentPath = router.pathname;
    if (logoutUser && exitRoutePath && currentPath === exitRoutePath) {
      setOpenConfirmLogOutAlert(false);
      logoutRequest();
    } else {
      exitRoutePath && console.log(`UPS exp: ${exitRoutePath} but actual: ${currentPath}`);
    }

    if (!logoutUser && router.pathname !== startRoutePath && openConfirmLogOutAlert) {
      setOpenConfirmLogOutAlert(false);
    }
  }, [router, logoutUser]);

  useEffect(() => {
    if (setOpenConfirmLogOutAlert) {
      setLogoutUser(false);
      setExitRoutePath(undefined);
      setStartRoutePath(router.pathname);
    } else {
      setStartRoutePath(undefined);
    }
  }, [openConfirmLogOutAlert]);

  const handleLogOut = (event) => {
    const { pathname, as } = router;
    const needsAuth = needsAuthRoute(pathname);

    event.preventDefault();

    const nextRoute = needsAuth ? '/login' : pathname;
    setExitRoutePath(nextRoute);
    setLogoutUser(true);
    router.push(nextRoute);
  };

  return (
    <AlertDialog
      title={`${t('auth.please_confirm', { ns: 'sidebar' })}`}
      text={`${t('auth.confirm_message_logout', { ns: 'sidebar' })}`}
      open={openConfirmLogOutAlert}
    >
      <Button onClick={() => { setOpenConfirmLogOutAlert(false) }} autoFocus>
        {`${t('cancel', { ns: 'buttons' })}`}
      </Button>
      <Button onClick={handleLogOut}>{`${t('logout', { ns: 'buttons' })}`}</Button>
    </AlertDialog>
  )
};
