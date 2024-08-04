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

  const { body: requestBody = {} } = req;

  const {
    name,
    subject,
    body,
    params = '{}',
    id,
  } = requestBody;

  try {
    const result = await sequelize.transaction(async (transaction) => {

      const idNumber = Number(id);

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

      let templateParams = '{}'

      if (params.trim().length > 0) {
        try {
          templateParams = JSON.parse(params);
          templateParams = JSON.stringify(templateParams, null, 2);
        } catch (e) {
          return {
            error: createErrorMessage("Template parameter error"),
            ERROR_CODE: 'TEMPLATE_PARAMETERS_ERROR'
          };
        }
      }

      const nextTemplate = {
        name,
        subject,
        body,
        params: templateParams,
      };

      await EmailTemplates.update(nextTemplate, {
        where: {
          id: idNumber,
        },
        transaction,
      });

      return {
        updated: true,
        SUCCESS_CODE: "SUCCESS_UPDATED_EMAIL_TEMPLATE",
        nextTemplate,
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
        error: createErrorMessage("Error update email template"),
        ERROR_CODE: "ERROR_UPDATE_EMAIL_TEMPLATE",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
