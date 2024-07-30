const _ = require('lodash');
const { Users, sequelize } = require('../../models');
const { send_mail_by_template: sendTemplateMail } = require('../__controllers');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');
const config = require('../../config/config');

const { host, port } = config['frontend'];

module.exports = async (req, res) => {
  const { body = {} } = req;
  const {
    email: inputEmail,
  } = body;

  const email = inputEmail.toLowerCase().trim();

  let result;
  try {
    result = await sequelize.transaction(async (transaction) => {
      const existUser = await Users.findOne({
        where: { email },
        attributes: ['id', 'firstname', 'lastname', 'locale'],
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

      const { id: UserID, firstname, lastname, locale } = existUser;
      const uuid = Math.floor(100000 + Math.random() * 900000);
      const updateUser = await Users.update({
        passwordrecoverid: uuid,
        passwordrecovertime: new Date().getTime(),
      }, {
        where: { email },
        transaction,
      });

      if (updateUser && updateUser.length === 1) {
        await sendTemplateMail({
          toUserId: UserID,
          template: `RecoveryPassword_${locale}`,
          params: {
            username: `${firstname} ${lastname}`,
            code: uuid,
            url: `${host}:${port}`
          }
        })
      }

      return {
        ok: true,
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
