const { v4: uuidv4 } = require('uuid');
const { send_mail_by_template: sendTemplateMail } = require('../__controllers');
const { createErrorMessage, handleSequelizeErrors } = require('../../utils');
const { Users, sequelize } = require('../../models');
const config = require('../../config/config');

const { host, port } = config['frontend'];

module.exports = async (req, res, tokenPayload) => {
  const { id: UserId } = tokenPayload;

  try {
    const result = await sequelize.transaction(async (transaction) => {

      let user = await Users.findOne({
        where: { id: UserId },
        transaction,
        raw: true,
      });

      if (!user) {
        return {
          error: createErrorMessage("User does not found"),
          ERROR_CODE: 'USER_NOT_FOUND'
        };
      }

      const { emailconfirmed, emailconfirmid, firstname, lastname, locale } = user;

      if (emailconfirmed) {
        return {
          error: createErrorMessage("Duplicate confirmation. Your email has been verified before!"),
          ERROR_CODE: 'CONFIRM_DUPLICATE'
        };
      }

      let uuid = emailconfirmid;
      if (!emailconfirmid) {
        uuid = Math.floor(100000 + Math.random() * 900000);
        const userUpdate = await Users.update({
          emailconfirmid: uuid,
        }, {
          where: {
            id: UserId,
          },
          transaction,
        });
      }

      await sendTemplateMail({
        toUserId: UserId,
        template: `ConfirmEmail_${locale}`,
        params: {
          username: `${firstname} ${lastname}`,
          code: uuid,
          url: `${host}:${port}`,
        }
      })

      return {
        updated: true,
        SUCCESS_CODE: "SUCCESS_SENT_EMAIL",
        confirmedEmail: user.email,
      };
    });

    if (result) {
      return {
        ok: true,
        ...result,
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error send email"),
        ERROR_CODE: "ERROR_SEND_EMAIL",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
