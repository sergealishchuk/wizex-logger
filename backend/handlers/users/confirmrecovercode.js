
const _ = require('lodash');
const { Users, sequelize } = require('../../models');
const { passwordRecoverTimeIntervalMS } = require('../../constants');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');


module.exports = async (req, res) => {
  const { body = {} } = req;
  const {
    email: inputEmail,
    code = '',
  } = body;

  const email = inputEmail.toLowerCase().trim();

  let result;
  try {
    result = await sequelize.transaction(async (transaction) => {
      const existUser = await Users.findOne({
        where: { email },
        attributes: ['id', 'passwordrecovertime', 'passwordrecoverid'],
        transaction,
        raw: true,
      });

      if (!existUser) {
        return {
          error: createErrorMessage(`User with email address ${email} does not exist`),
          ERROR_CODE: {
            name: 'USER_WITH_EMAIL_NOT_EXISTS',
            params: {
              email,
            }
          }
        };
      }

      const { id: UserID, passwordrecovertime, passwordrecoverid } = existUser;
      const currentTime = new Date().getTime();
      const timeRecoverExpired = ((passwordRecoverTimeIntervalMS - currentTime - passwordrecovertime) > 0);

      const codeIsValid = String(passwordrecoverid).trim() === code.trim();

      if (!passwordrecoverid) {
        return {
          error: createErrorMessage(`Recover code not found`),
          ERROR_CODE: {
            name: 'RECOVER_CODE_NOT_FOUND',
          }
        }
      }

      if (timeRecoverExpired) {
        await Users.update({
          passwordrecoverid: null,
          passwordrecovertime: null,
        }, {
          where: { id: UserID },
          transaction,
        });

        return {
          error: createErrorMessage(`Password reset timed out`),
          ERROR_CODE: {
            name: 'RECOVER_PASSWORD_TIME_EXPIRED',
          }
        }
      } else if (!codeIsValid) {
        return {
          error: createErrorMessage(`Recovery Code is not valid.`),
          ERROR_CODE: {
            name: 'CODE_IS_NOT_VALID',
          }
        }
      } else {
        return {
          ok: true,
        }
      }
    });

    return {
      ...result,
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(
      {
        error: createErrorMessage("Error recover password"),
        ERROR_CODE: "ERROR_RECOWER_PASSWORD",
        serror: handleSequelizeErrors(error),
      }
    );
  }
};
