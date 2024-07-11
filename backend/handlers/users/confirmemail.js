const _ = require('lodash');
const { createErrorMessage } = require('../../utils');
const { User } = require('../../models');

module.exports = async (parameters, res, tokenPayload) => {
  const { body = {} } = parameters;
  const { emailconfirmid } = body;
  
  let user = await User.findOne({ where: { emailconfirmid }});
  if (!user) {
    return {
      error: createErrorMessage('Error, please try again!'),
      status: 400,
    }
  }

  const emailconfirmed = user.getDataValue('emailconfirmed');

  if (emailconfirmed) {
    return {
      status: 200,
      code: 'CONFIRM_DUBLICATE',
      validationMessage: 'Duplicate confirmation. Your email has been verified before!',
    }
  }

  await User.update({
    emailconfirmed: true,
  }, { where: { emailconfirmid } });

  return {
    status: 200,
    code: 'EMAIL_CONFIRMED',
  }
};
