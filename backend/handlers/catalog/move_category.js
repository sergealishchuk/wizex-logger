
const _ = require("lodash");
const { ROLES } = require("../../constants");
const { Users, Categories, sequelize } = require('../../models');

const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../utils');

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

  const { currentCategoryId, nextParentId: nextParentIdOriginal } = body;
  const nextParentId = nextParentIdOriginal === -1 ? 1 : nextParentIdOriginal;

  let result;
  try {

    result = await sequelize.transaction(async (transaction) => {
      const CategoriesData = await Categories.findAll({
        order: [['id', 'ASC']],
        attributes: ['id', 'parentid', 'index', 'leaf'],
        where: {},
        raw: true,
      });

      const catIndex = _.findIndex(CategoriesData, item => item.id === currentCategoryId);
      if (catIndex > -1) {
        const allSubCategoriesIndexes = _.filter(CategoriesData, item => item.parentid === nextParentId)
          .map(item => item.index);
        const maxSubCategory = Math.max.apply(null, allSubCategoriesIndexes);
        CategoriesData[catIndex] = {
          ...CategoriesData[catIndex],
          index: maxSubCategory + 1,
          parentid: nextParentId,
        };
      }

      for (let i = 0; i < CategoriesData.length; ++i) {
        const { id, parentid, index} = CategoriesData[i];
        await Categories.update(
          {
            parentid,
            index,
          },
          {
            where: { id },
            transaction,
          }
        );
      }
    });

    res.status(200).json({ ok: true, data: { nextCategory: nextParentId } });
  } catch (e) {
    console.log('ERROR::', e);
    res.status(400).json(
      { error: createErrorMessage("Error move category") }
    );
  }
};
