const _ = require('lodash');
const errorTypes = require('../constants/errorTypes');

module.exports = (error) => {
  const { errors = [], name } = error;

  return (errors.length > 0)
    ? {
      error: {
        ...error,
        errors: _.map(errors, ({ message, type, path, value }) =>
          ({ message, type, path, value })),
        name: errorTypes(name),
      },
    }
    : {
      ...error,
      handled: false,
    };
};
