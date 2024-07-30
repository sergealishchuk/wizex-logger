const _ = require('lodash');
const { createErrorMessage, handleSequelizeErrors } = require('../../utils');
const { Users, sequelize } = require('../../models');

module.exports = async (req, res, tokenPayload) => {

  const { body = {} } = req;
  const { emailconfirmid, email } = body;

  try {
    const result = await sequelize.transaction(async (transaction) => {

      let user = await Users.findOne({
        where: { email },
        transaction,
        raw: true,
      });

      if (!user) {
        return {
          error: createErrorMessage("Account with this email not found"),
          ERROR_CODE: 'ACCOUNT_NOT_FOUND'
        };
      }

      const { emailconfirmid: userEmailConfirmedId, emailconfirmed } = user;
      if (emailconfirmed) {
        return {
          SUCCESS_CODE: "EMAIL_CONFIRMED_BEFORE",
          confirmedEmail: user.email,
        };
      }

      if (userEmailConfirmedId === emailconfirmid) {
        const update = await Users.update({
          emailconfirmed: true,
          emailconfirmid: null,
        }, {
          where: {
            email,
            emailconfirmid,
          },
          transaction,
        });
      } else {
        return {
          error: createErrorMessage("Code confirmed error"),
          ERROR_CODE: 'CODE_CONFIRMED_ERROR'
        };
      }

      return {
        updated: true,
        SUCCESS_CODE: "SUCCESS_EMAIL_CONFIRMED",
        confirmedEmail: user.email,
      };
    });

    return {
      ok: true,
      ...result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error confirm email"),
        ERROR_CODE: "ERROR_CONFIRM_EMAIL",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
