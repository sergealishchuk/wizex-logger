const _ = require('lodash');

const errorTypes = {
    SequelizeValidationError: 'ValidationError',
};

module.exports = (typeError) => _.get(errorTypes, `${typeError}`, typeError);
