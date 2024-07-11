/**
  import store from '~/utils/store';
  
  var myListenerHandlerRef = store.addListener(
    'card.productsCounter.a.b.c.d.e.f.g.s.k',
    (value, prevValue, path) => {
      console.log('listener:', value, prevValue, path);
    }
  );

  store.set('card.productsCounter.a.b.c.d.e.f.g.s.k', 79);
  // listener: 79 69 card.productsCounter.a.b.c.d.e.f.g.s.k

  store.removeListener(myListenerHandlerRef);
 * 
 */

// import get from 'lodash-es/get';
// import set from 'lodash-es/set';
// import remove from 'lodash-es/remove';
// import each from 'lodash-es/each';
import { _ } from '~/utils';
import commonStorage from './commonStorage';

// const _ = {
//   get,
//   set,
//   remove,
//   each,
// }

// const _ = {
//   get(obj, query, defaultVal) {
//     query = Array.isArray(query) ? query : query.replace(/(\[(\d)\])/g, '.$2').replace(/^\./, '').split('.');
//     if (!(query[0] in obj)) {
//       return defaultVal;
//     }
//     obj = obj[query[0]];
//     if (obj && query.length > 1) {
//       return this.get(obj, query.slice(1), defaultVal);
//     }
//     return obj;
//   },

//   set(object, path, value) {
//     const decomposedPath = path.split('.');
//     const base = decomposedPath[0];

//     if (base === undefined) {
//       return object;
//     }

//     // assign an empty object in order to spread object
//     if (!object.hasOwnProperty(base)) {
//       object[base] = {};
//     }

//     // Determine if there is still layers to traverse
//     value = decomposedPath.length <= 1 ? value : set(object[base], decomposedPath.slice(1).join('.'), value);

//     return {
//       ...object,
//       [base]: value,
//     }
//   }
// };

const STORE = 'store';
const Listeners = {};

const Store = {

  get: (path) => {
    const state = commonStorage.getObject(`${STORE}`);

    return _.get(state, path);
  },

  set: (path, value, force = false) => {
    const existStore = commonStorage.get(`${STORE}`);
    if (!existStore || existStore === 'undefined') {
      commonStorage.setObject(`${STORE}`, {});
    }
    const state = commonStorage.getObject(`${STORE}`);
    const currentValue = _.get(state, path);

    if ((JSON.stringify(currentValue) !== JSON.stringify(value)) || force) {
      _.set(state, path, value);
      commonStorage.setObject(`${STORE}`, state);

      const splitedPath = path.split('.');
      _.each(splitedPath, (element, index) => {
        const subPath = splitedPath.slice(0, index + 1).join('.');
        if (Listeners[subPath]) {
          Listeners[subPath].forEach(function (handler) {
            handler(value, currentValue, subPath);
          })
        }
      });
    }
  },

  getState: () => {
    return commonStorage.getObject(`${STORE}`);
  },

  addListener: (path, cb) => {
    if (!Listeners[path]) {
      Listeners[path] = [];
    }
    Listeners[path].push(cb);
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

export default Store;
