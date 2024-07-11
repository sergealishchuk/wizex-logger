const _ = require("lodash");
const { ROLES } = require("../../../../constants");
const { Users, ArticlesTags, sequelize } = require('../../../../models');
const { adjust_values_order } = require('../controllers');
const { Op } = require("sequelize");
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../../../utils');

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
    const result = await sequelize.transaction(async (t) => {
      const { values = [] } = body;

      const tagsValuesList = await ArticlesTags.findAll({
        order: [['index', 'ASC']],
        attributes: ['id', 'index'],
        raw: true,
      });

      if (_.isArray(values) && values.length !== tagsValuesList.length) {
        res.status(400).json(
          {
            error: createErrorMessage("Length tags does not equel to source"),
            ERROR_CODE: "TAG_VALUES_LENGTH_DOES_NOT_MATCH"
          }
        );
        return;
      }

      if (
        _.map(tagsValuesList, item => item.id).sort().toString() !==
        [...values].sort().toString()
      ) {
        res.status(400).json(
          {
            error: createErrorMessage("Tag set does not equel to source"),
            ERROR_CODE: "TAG_VALUES_IDS_DOES_NOT_MATCH"
          }
        );
        return;
      }

      const valuesListUpdate = _.map(values, (value, index) => ({
        id: value,
        index,
      }));

      await adjust_values_order({
        valuesListUpdate,
        transaction: t,
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
        error: createErrorMessage("Error add Attribute"),
        ERROR_CODE: "ERROR_ARRANGE_ATTRIBUTE_VALUES"
      }
    );
  }
};
