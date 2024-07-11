const _ = require('lodash');

module.exports = (messages) => {
  const messageList = _.isArray(messages) ? messages : [messages];
  return {
    errors: _.map(messageList, message => ({ message })),
  };
};
