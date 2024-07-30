import commonStorage from './commonStorage';
import store from './store';
import Observer from './observer';
import sleep from './sleep';
import usePreserveScroll from './usePreserveScroll';
import createSSRErrorResponse from './createSSRErrorResponse';
import needsAuthRoute from './needsAuthRoute';
import createInvoke from './createInvoke';
import poll from './poll';
import translateByCode from './translateByCode';
import pushResponseMessages from './pushResponseMessages';
import getCurrentTimeMinSec from './getCurrentTimeMinSec';
import getLocalDate from './getLocalDate';
import getDiffTime from './getDiffTime';
import isBrowser from './isBrowser';
import { setCookie, getCookie, eraseCookie } from './cookies';
import * as _ from './slodash';
//import _ from 'lodash';
import SSRErrorHandler from './SSRErrorHandler';
import createHttpRequestOptions from './createHttpRequestOptions';
import changeLocale from './changeLocale';
import confirmDialog from './confirmDialog';
import searchCatalogFilter from './searchCatalogFilter';
import ukToTranslit from './uk_to_translit';
import getTimeBySec from './getTimeBySec';
import getDiffWithcurrentStr from './getDiffWithCurrentStr';
import getResponseMessage from './getResponseMessage';
import handleStringWithParams from './handleStringWithParams';
import copyToClipboard from './copyToClipboard';

if (typeof(window) !== 'undefined') {
  window.store = store;
  window.slodash = _;
}

export {
  commonStorage,
  store,
  Observer,
  sleep,
  usePreserveScroll,
  createSSRErrorResponse,
  needsAuthRoute,
  createInvoke,
  poll,
  translateByCode,
  pushResponseMessages,
  getCurrentTimeMinSec,
  getLocalDate,
  getDiffTime,
  isBrowser,
  setCookie,
  getCookie,
  eraseCookie,
  _,
  SSRErrorHandler,
  createHttpRequestOptions,
  changeLocale,
  confirmDialog,
  searchCatalogFilter,
  ukToTranslit,
  getTimeBySec,
  getDiffWithcurrentStr,
  getResponseMessage,
  handleStringWithParams,
  copyToClipboard,
};
