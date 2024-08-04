const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Users, EmailTemplates, sequelize } = require('../../../models');
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../../utils');

const { record_add } = require('../../__controllers');

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

  const { body: bodyRequest = {} } = req;

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const {
        name,
        subject,
        body,
        params = '{}',
        addAfter = -1,
      } = bodyRequest;

      const existEmailTemplate = await EmailTemplates.findAll({
        where: {
          name,
        },
        raw: true,
      });

      if (existEmailTemplate.length > 0) {
        return {
          error: createErrorMessage("The Template Name must be unique"),
          ERROR_CODE: 'TEMPLATE_NAME_EXIST'
        };
      }

      let templateParams = '{}'
      try {
        templateParams = JSON.parse(params);
        templateParams = JSON.stringify(templateParams, null, 2);
      }catch(e) {
        return {
          error: createErrorMessage("Template parameter error"),
          ERROR_CODE: 'TEMPLATE_PARAMETERS_ERROR'
        };
      }

      const newEmailTemplate = await record_add({
        model: EmailTemplates,
        data: {
          name,
          subject,
          body,
          params: templateParams,
        },
        addAfter,
        transaction,
      });

      return {
        created: true,
        ok: true,
        SUCCESS_CODE: "SUCCESS_ADDED_EMAIL_TEMPLATE",
        newEmailTemplate,
      }
    });

    return {
      ...result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error add Email Template"),
        ERROR_CODE: "ERROR_CREATE_EMAIL_TEMPLATE",
        e: handleSequelizeErrors(e),
      }
    );
  }
};
