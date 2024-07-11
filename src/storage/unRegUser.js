import { store, _ } from '~/utils';
import {
  isBrowser,
  unRegUser,
} from './constants';


const LocalStoragePath = unRegUser;

export default {
  read() {
    return isBrowser()
      ? store.get(`${LocalStoragePath}`)
      : {};
  },

  save(value, force = false) {
    store.set(`${LocalStoragePath}`, value, force)
  },

  update(value, force = false) {
    const user = this.read();
    this.save({
      ...user,
      ...value,
    }, force);
  },

  clear() {
    store.set(`${UserStorePath}`, {});
  },
};
