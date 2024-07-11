import { _ } from '~/utils';
import store from '~/utils/store';

export const isBrowser = () => typeof (window) !== 'undefined';
export const isUserLogged = () =>
  Boolean(
    _.get(isBrowser() && store.get(`${UserStorePath}`), 'email', false)
  );

// Unregistered User
export const unRegUser = 'unRegUserInfo';

// Registered User
export const UserStorePath = 'userInfo';