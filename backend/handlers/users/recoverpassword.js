const _ = require('lodash');
const md5 = require("md5");
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');
const { passwordRecoverTimeIntervalMS } = require('../../config');
const { Users } = require('../../models');

const RECOVER_ERROR_MESSAGE = 'Password recovery time is out of date';

const validatePassword = (data) => {
  const { password = "" } = data;
  const error = {};
  // pass
  const passwordStr = password.trim();
  if (passwordStr.length === 0) {
    error.password = "Password is required";
  } else if (passwordStr.length < 5) {
    error.password = "Password length must be more then 5 chars";
  } else if (/\s/.test(passwordStr)) {
    error.password = "Password must not contain spaces";
  } else if (passwordStr.length > 32) {
    error.password = "Password length must be less then 32 chars";
  }
  return error;
};

module.exports = async (parameters, res) => {
  const { body = {} } = parameters;
  const {
    email: inputEmail,
    password,
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

  if (!(passwordrecovertime && passwordrecoverid)) {
    return {
      error: createErrorMessage('Recovery Code is not valid. Please try again.'),
      status: 400,
    }
  }

  const currentTime = new Date().getTime();
  const timeRecoverExpired = ((currentTime - passwordrecovertime - passwordRecoverTimeIntervalMS - 60000) > 0);

  const errorsValidation = validatePassword({
    password,
  });

  if (!_.isEmpty(errorsValidation)) {
    return {
      error: createErrorMessage(errorsValidation.password),
      code: "VALIDATAION",
      status: 400,
    };
  } else if (timeRecoverExpired) {
    await Users.update({
      passwordrecoverid: null,
      passwordrecovertime: null,
    }, { where: { id } });

    return {
      error: createErrorMessage(RECOVER_ERROR_MESSAGE),
      code: "RECOVER_TIME_EXPIRED",
      status: 400,
    }
  } else {
    await Users.update({
      password: md5(password),
      passwordrecoverid: null,
      passwordrecovertime: null,
    }, { where: { id } });

    return {
      ok: true,
    }
  }
};
