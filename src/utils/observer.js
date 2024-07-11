import { _ } from '~/utils';
// import remove from 'lodash-es/remove';
// import each from 'lodash-es/each';

// const _ = {
//   remove,
//   each,
// }

const Listeners = {};

const Observer = {

  send: (name, params, cb) => {
    if (Listeners[name]) {
      Listeners[name].forEach(function (handler) {
        handler(params, cb)
      })
    }
  },

  asyncSend: (name, params) => new Promise((resolve, reject) => {
    if (Listeners[name]) {
      Listeners[name].forEach((handler) => {
        handler(params, (result) => {
          resolve(result);
        });
      })
    }
  }),

  addListener: (name, cb) => {
    if (!Listeners[name]) {
      Listeners[name] = [];
    }
    Listeners[name].push(cb);
    return cb;
  },

  removeListener: (listener) => {
    if (typeof (listener) === 'string') {
      delete Listeners[listener];
    } else if (typeof (listener) === 'function') {
      _.each(Listeners, (item) => {
        _.remove(item, (item) => item === listener);
      })
    }
  },

  getListeners: () => {
    return Listeners;
  }
};

export default Observer;
