const _ = require('lodash');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');
const { passwordRecoverTimeIntervalMS } = require('../../config');
const { Users } = require('../../models');

const RECOVER_ERROR_MESSAGE = 'Recovery Code is expared. Please try again.';
const NOVALID_ERROR_MESSAGE = 'Recovery Code is not valid. Please try again.';

module.exports = async (parameters, res) => {
  const { body = {} } = parameters;
  const {
    email: inputEmail,
    code,
  } = body;

  const email = inputEmail.toLowerCase().trim();


  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return {
      error: createErrorMessage('No user found with this email address!'),
      status: 400,
    }
  }

  const { id, passwordrecovertime, passwordrecoverid } = user;
  const currentTime = new Date().getTime();
  const timeRecoverExpired = ((currentTime - passwordrecovertime - passwordRecoverTimeIntervalMS) > 0);

  const codeIsValid = String(passwordrecoverid).trim() === code.trim();

  if (timeRecoverExpired) {
    await Users.update({
      passwordrecoverid: null,
      passwordrecovertime: null,
    }, { where: { id } });

    return {
      error: createErrorMessage(RECOVER_ERROR_MESSAGE),
      code: "RECOVER_TIME_EXPIRED",
      status: 400,
    }
  } else if (!codeIsValid) {
    return {
      error: createErrorMessage(NOVALID_ERROR_MESSAGE),
      code: "CODE_IS_NOT_VALID",
      status: 400,
    }
  } else {
    return {
      ok: true,
    }
  }
};