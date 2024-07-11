const _ = require("lodash");
const { ROLES } = require("../../../../constants");
const { Users, ArticlesTags, sequelize } = require('../../../../models');
const { adjust_values_order } = require('../controllers');
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
      const { addAfter = -1, name } = body;

      const valuesList = await ArticlesTags.findAll({
        order: [['index', 'ASC']],
        attributes: ['id', 'index'],
        raw: true,
      });
      
      const newValue = await ArticlesTags.create(
        {
          name,
        },
        {
          transaction: t,
        }
      );
      //@Alex12346
      const indexAfter = Number(addAfter);
      let indexInList = valuesList.length;
      if (indexAfter > -1) {
        const existValueRecordIndex = _.findIndex(valuesList, item => item.id === indexAfter);
        if (existValueRecordIndex > -1) {
          indexInList = existValueRecordIndex + 1;
        }
      }
      const valueListCopy = [...valuesList];
      valueListCopy.splice(indexInList, 0, {
        id: newValue.id,
        index: 0,
      });

      const valueListCopyIndexed = _.map(valueListCopy, (item, index) => ({
        ...item,
        index,
      }));

      const valuesListUpdate = _.filter(valueListCopyIndexed, value => {
        return !_.find(valuesList, item => item.id === value.id && item.index === value.index);
      });

      await adjust_values_order({
        valuesListUpdate,
        transaction: t,
      });

      return {
        newValue,
      }
    });

    return {
      ok: true,
      SUCCESS_CODE: "SUCCESS_ADDED_TAG_VALUE",
      result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error add value"),
        ERROR_CODE: "ERROR_CREATE_VALUE"
      }
    );
  }
};
