const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Users, EmailTemplates, sequelize } = require('../../../models');
const { adjust_order } = require('../../__controllers');
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

  const { body = {} } = req;

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const { values = [] } = body;

      const emailTemplatesList = await EmailTemplates.findAll({
        order: [['index', 'ASC']],
        attributes: ['id', 'index'],
        raw: true,
      });

      if ((_.isArray(values) && values.length !== emailTemplatesList.length)
        || (_.map(emailTemplatesList, item => item.id).sort().toString() !== [...values].sort().toString())) {
        res.status(400).json(
          {
            error: createErrorMessage("Length block of email templates does not equel to source"),
            ERROR_CODE: "EMAIL_TEMPLATES_LENGTH_DOES_NOT_MATCH"
          }
        );
        return;
      }
      
      const listUpdate = _.map(values, (value, index) => ({
        id: value,
        index,
      }));

      await adjust_order({
        model: EmailTemplates,
        listUpdate,
        transaction,
      });

      return {
        sorted: 'ok',
      }
    });

    return {
      ok: true,
      result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error arrange email templates"),
        ERROR_CODE: "ERROR_ARRANGE_EMAIL_TEMPLATES"
      }
    );
  }
};
