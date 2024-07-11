
const _ = require("lodash");
const { v4 } = require('uuid');
const { Op } = require("sequelize");
const { ROLES } = require("../../constants");
const { Users, Categories, Goods, sequelize } = require('../../models');
const {
  handleSequelizeErrors,
  createErrorMessage,
  parseForm,
  fileService,
} = require('../../utils');
const { storage: { remoteDirPath } } = require('../../config/config');

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

  const { currentCategoryId, nextCategoryId } = body;

  let result;
  try {

    result = await sequelize.transaction(async (transaction) => {

      const update = await Goods.update(
        {
          categoryId: nextCategoryId,
        },
        {
          where: { categoryId: currentCategoryId },
          transaction,
        }
      );
      return update;
    });

    res.status(200).json({ ok: true, data: {nextCategory: nextCategoryId} });
  } catch (e) {
    console.log('ERROR::', e);
    res.status(400).json(
      { error: createErrorMessage("Error move category") }
    );
  }
};
