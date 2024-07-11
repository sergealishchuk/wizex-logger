/**
 *  API request configuration.
 */

import axios from 'axios';
import { _ } from '~/utils';
import guiConfig from "~/gui-config";
import User from '~/components/User';
import Observer from "~/utils/observer";


const { apiUrl } = guiConfig;
const instance = axios.create({
  baseURL: apiUrl,
  responseType: 'json',
});

instance.interceptors.request.use(
  (config) => {

    const newConfig = config;

    newConfig.headers['X-Requested-With'] = 'XMLHttpRequest';
    newConfig.headers.Expires = '-1';
    newConfig.headers['Cache-Control'] = 'no-cache,no-store,must-revalidate,max-age=-1,private';

    const userInfo = User.read();

    if (userInfo && userInfo.data) {
      const { token } = userInfo.data;
      if (token) {
        newConfig.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    if (config.method === 'get') {
      newConfig.url += newConfig.url.indexOf('?') !== -1 ? `&_time=${Date.now()}` : `?_time=${Date.now()}`;
    }

    return newConfig;
  },
  (err) => { return Promise.reject(err) },
);

instance.interceptors.response.use(
  (res) => {
    const { data, status } = res;

    if (data && _.isObject(data)) {
      data.responseStatus = status;
    }

    const contentType = _.get(res, 'headers.content-type', '');
    const server = _.get(res, 'headers.server', '');

    if (data && data.code === 417) {
      return Promise.reject({
        XHRResponse: {
          status: 417,
          ...data,
        },
        typeOfError: 'XHRError',
      });
    }

    if (!data && contentType.startsWith('text/html') && server === 'Apache') {
      // 440 Login Time-out
      // The client's session has expired and must log in again.
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        XHRResponse: {
          status: 440,
        },
        typeOfError: 'XHRError',
      });
    }

    return data || {};
  },
  (err) => {
    const { response = {}, code } = err;
    const { status } = response;

    if (status === 401) {
      //location.reload(); // force reload

      Observer.send('OpenSignInDialog', { err }, (router) => {
        router.reload();
      });
    }
    const XHRResponse = _.get(err, 'response', {});

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ errorCode: code, XHRResponse, typeOfError: 'XHRError' });
  },
);

export const { post, get, put, delete: _delete } = instance;
//export const delete = instance.delete;

export default instance;
