import { _ } from '~/utils';
import { useState, useEffect } from "react";

const store = {};

const dispatchers = [];

export const getStore = () => store;

export const connect = (paths) => (Component) => (props) => {
  const [myStore, setMyStore] = useState(store);

  useEffect(() => {
    dispatchers.push([
      setMyStore,
      Object.assign({}, ...paths.map(path => ({ [path]: true }))),
    ]);
    return () => {
      const findIndex = _.findIndex(
        dispatchers,
        item => item === setMyStore
      );
      if (findIndex > -1) {
        dispatchers.splice(findIndex);
      }
    }
  }, []);

  return <Component {...props} store={myStore} />
};

export const dispatch = (path, value) => {
  const currentValue = _.get(store, path);
  _.set(store, path, value);
  if (!_.isEqual(currentValue, value)) {
    _.forEach(dispatchers, ([setter, paths]) => {
      if (paths[path]) {
        setter({ ...store });
      }
    });
  }
};

export const pushTrigger = (path) => {
  const currentValue = _.get(store, path) || 0;
  dispatch(path, currentValue + 1);
};

const Shed = {
  getStore,
  connect,
  dispatch,
  pushTrigger,
};

export default Shed;
