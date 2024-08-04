const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Users, EmailTemplates, sequelize } = require('../../../models');
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../../utils');

module.exports = async (req, res, tokenPayload) => {
  const UserID = tokenPayload.id;
  const user = await Users.findOne({
    where: { id: UserID },
    attributes: ['id', 'roles'],
    raw: true,
  });

  if (!user) {
    res.status(400).json(
      {
        error: createErrorMessage("User does not exist!"),
        ERROR_CODE: "USER_DOES_NOT_EXIST"
      }
    );
    return;
  }

  const { roles } = user;

  if (!roles.includes(ROLES.ADMIN)) {
    res.status(400).json(
      {
        error: createErrorMessage("No permisions"),
        ERROR_CODE: "NO_PERMISSIONS"
      }
    );
    return;
  }

  const {
    params: { id },
  } = req;

  const idNumber = Number(id);

  try {
    const result = await sequelize.transaction(async (transaction) => {

      const existEmailTemplate = await EmailTemplates.findOne({
        where: {
          id: idNumber,
        },
        raw: true,
      });

      if (!existEmailTemplate) {
        return {
          error: createErrorMessage("Email Template not found"),
          ERROR_CODE: 'EMAIL_TEMPLATE_NOT_FOUND'
        };
      }

      await EmailTemplates.destroy({
        transaction,
        where: {
          id: idNumber,
        },
      });

      return {
        removed: true,
        SUCCESS_CODE: "SUCCESS_REMOVE_EMAIL_TEMPLATE",
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
        error: createErrorMessage("Error remove Email Template"),
        ERROR_CODE: "ERROR_REMOVE_EMAIL_TEMPLATE",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
