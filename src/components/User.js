import { store, _ } from '~/utils';
import { dispatch } from '~/utils/shed';
export const UserStorePath = 'userInfo';

export default {
  isBrowser() {
    return typeof (window) !== 'undefined';
  },

  getToken() {
    return isBrowser() ? _.get(this.read(), 'data.token', '') : '';
  },

  read() {
    if (!this.isBrowser()) {
      return {};
    }

    return store.get(`${UserStorePath}`);
  },

  userIsLoggedIn() {
    if (!this.isBrowser()) {
      return null;
    }
    return Boolean(_.get(this.read(), 'data.token', false));
  },

  isLog() {
    return Boolean(_.get(this.read(), 'email', false));
  },

  save(value, force = false) {
    store.set(`${UserStorePath}`, value, force)
  },

  updateUserInfo(value, force = false) {
    const user = this.read();
    const userInfo = {
      ...user,
      ...value,
    };
    this.save(userInfo, force);
    //this.profileLoaded = true;
    dispatch('updateUserInfo', userInfo);
  },

  updateUserTokens(value, force = false) {
    const user = this.read();
    this.save({
      user,
      data: value,
    }, force);
  },

  clear() {
    store.set(`${UserStorePath}`, {});
  },
};
