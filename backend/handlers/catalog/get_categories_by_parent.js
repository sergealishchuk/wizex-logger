const _ = require("lodash");
const { Op } = require("sequelize");
const { ROLES } = require("../../constants");
const { Users, Categories, Goods, sequelize } = require('../../models');


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

  let { parentId = 1 } = body;
  if (parentId === 'null') {
    parentId = null;
  }

  try {
    const CategoriesData = await Categories.findAll({
      order: [['id', 'ASC']],
      attributes: ['id', 'parentid', 'index', 'name', 'nameen', 'path', 'leaf'],
      where: {},
      raw: true,
    });

    const categoriesByParent = _.filter(CategoriesData, item => item.parentid === Number(parentId));

    const leafCategoriesIds = _.filter(categoriesByParent, item => item.leaf).map(item => item.id);

    let leafCountsMap = {};
    let leafCounts = [];

    if (leafCategoriesIds.length > 0) {
      leafCounts = await Goods.findAll({
        where: {
          categoryId: { [Op.in]: leafCategoriesIds },
        },
        attributes: ['categoryId', [sequelize.fn('COUNT', sequelize.col('id')), 'ProductsCount']],
        group: ['categoryId'],
        raw: true,
      });

      leafCountsMap = leafCounts.length > 0
        ? Object.assign({}, ...leafCounts.map(item => ({ [item.categoryId]: Number(item.ProductsCount) })))
        : {};
    }

    const adjustCategories = _.map(categoriesByParent, item => {

      let countGoods = !_.isUndefined(leafCountsMap[item.id]) ? leafCountsMap[item.id] : 0;
      let deletable = item.leaf
        ? countGoods === 0
        : !_.find(CategoriesData, catItem => Number(catItem.parentid) === Number(item.id));

      return ({
        ...item,
        parentid: item.parentid === null ? null : Number(item.parentid),
        count: countGoods,
        deletable,
      })
    });

    const categoriesMap = Object.assign({}, ...adjustCategories.map(item => {
      return {
        [item.id]: item,
      }
    }));

    let currentParent = parentId;
    const path = [];
    let count = 30;
    while (currentParent && count > 0) {
      --count;
      const findCategory = _.find(CategoriesData, item => item.id === Number(currentParent));
      if (findCategory) {
        path.push(findCategory);
        currentParent = findCategory.parentid;
      } else {
        currentParent === null;
      }
    }

    if (count === 0) {
      console.log('Catalog Error');
    }

    const allCounts = await Goods.findAll({
      attributes: ['categoryId', [sequelize.fn('COUNT', sequelize.col('id')), 'ProductsCount']],
      group: ['categoryId'],
      raw: true,
    });
    return {
      ok: true,
      data: {
        categories: _.orderBy(adjustCategories, 'index'),
        allCategories: CategoriesData,
        categoriesMap,
        path: path.reverse(),
        leafCounts,
        allCounts,
      },
    };
  } catch (error) {
    console.error(error);
    res.status(400)
      .json({ error: { errors: [{ message: "Data errors!" }] } });
  }
};
