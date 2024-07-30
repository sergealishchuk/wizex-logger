const md5 = require("md5");
const { Users, ProfileChangesLog, sequelize } = require('../../models');
const { passwordRecoverTimeIntervalMS } = require('../../constants');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');
const { send_mail_by_template: sendTemplateMail } = require('../__controllers');
const config = require('../../config/config');

const { host, port } = config['frontend'];

const validatePassword = (passwd) => {
  const exp = /^(?=.*[0-9])(?=.*[a-zA-Z])(?!.* ).{6,32}$/;
  return exp.test(passwd);
};

module.exports = async (req, res) => {
  const { body = {} } = req;
  const {
    email: inputEmail,
    password,
    code,
  } = body;
  const email = inputEmail.toLowerCase().trim();

  let result;
  try {
    result = await sequelize.transaction(async (transaction) => {
      const existUser = await Users.findOne({
        where: { email },
        attributes: ['id', 'firstname', 'lastname', 'passwordrecovertime', 'passwordrecoverid', 'locale'],
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

      const { id: UserID, firstname, lastname, passwordrecovertime, passwordrecoverid, locale } = existUser;

      if (!passwordrecoverid) {
        return {
          error: createErrorMessage(`Recover code not found`),
          ERROR_CODE: {
            name: 'RECOVER_CODE_NOT_FOUND',
          }
        }
      }

      if (!validatePassword(password)) {
        return {
          error: createErrorMessage(`The password is invalid`),
          ERROR_CODE: {
            name: 'PASSWORD_IS_INVALID',
          }
        }
      }

      const currentTime = new Date().getTime();
      const timeRecoverExpired = ((passwordRecoverTimeIntervalMS - currentTime - passwordrecovertime) > 0);

      const codeIsValid = String(passwordrecoverid).trim() === code.trim();

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
        await Users.update({
          password: md5(password),
          passwordrecoverid: null,
          passwordrecovertime: null,
        }, {
          where: { id: UserID },
          transaction,
        });

        await ProfileChangesLog.create(
          {
            comment: '[user_reset_password]',
            userId: UserID,
            authorId: UserID,
          },
          {
            transaction,
          });

        return {
          ok: true,
          SUCCESS_CODE: "SUCCESS_CHANGE_PASSWORD",
          user: {
            UserID,
            firstname,
            lastname,
            locale,
          }
        }
      }
    });

    if (result && result.SUCCESS_CODE === "SUCCESS_CHANGE_PASSWORD") {
      const { user: { UserID, firstname, lastname, locale } } = result;
      await sendTemplateMail({
        toUserId: UserID,
        template: `PasswordHasBeenChanged_${locale}`,
        params: {
          username: `${firstname} ${lastname}`,
          url: `${host}:${port}`
        }
      })
    }

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
