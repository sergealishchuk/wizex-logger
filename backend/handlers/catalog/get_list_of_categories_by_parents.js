const _ = require("lodash");
const { Op } = require("sequelize");
const { ROLES } = require("../../constants");
const { Users, Categories, Goods, Attributes, AttributesValue, sequelize } = require('../../models');
const { get_category_path } = require('./controllers');


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

  let { parents: [parentIdLeft = 1, parentIdRight = 1] } = body;
  if (parentIdLeft === null) {
    parentIdLeft = 1;
  }
  if (parentIdRight === null) {
    parentIdRight = 1;
  }
  try {
    const CategoriesData = await Categories.findAll({
      order: [['id', 'ASC']],
      attributes: ['id', 'parentid', 'index', 'name', 'nameen', 'path', 'leaf', 'seo'],
      order: [['index', 'ASC']],
      raw: true,
    });
    const productCounts = await Goods.findAll({
      attributes: ['categoryId', [sequelize.fn('COUNT', sequelize.col('id')), 'ProductsCount']],
      group: ['categoryId'],
      raw: true,
    });

    const categoriesLeafs = _.filter(CategoriesData, item =>
    ((item.parentid === Number(parentIdRight) || (item.parentid === Number(parentIdLeft)) && item.leaf
    ))).map(item => item.id);

    const attributesList = await Attributes.findAll({
      where: {
        categoryId: {
          [Op.in]: categoriesLeafs,
        }
      },
      attributes: ['categoryId', [sequelize.fn('COUNT', sequelize.col('categoryId')), 'AttributesCount']],
      group: ['categoryId'],
      raw: true,
    });
    const attributesListMap = Object.assign({}, ...attributesList.map(item => ({
      [item.categoryId]: Number(item.AttributesCount),
    })));

    const countsMap = Object.assign({}, ...productCounts.map(item => ({ [item.categoryId]: Number(item.ProductsCount) })));
    const categoriesMap = Object.assign({}, ...CategoriesData.map(item => ({
      [item.id]: {
        ...item,
        count: countsMap[item.id] || 0,
        att_count: item.leaf ? attributesListMap[item.id] || 0 : undefined,
      }
    })));

    _.forEach(categoriesMap, (item, key) => {
      if (item.leaf) {
        let count = item.count;
        if (count > 0) {
          let parentid = item.parentid;
          let cnt = 100; // todo: remove later
          while (parentid !== null && cnt) {
            categoriesMap[parentid].count = categoriesMap[parentid].count + count;
            parentid = categoriesMap[parentid].parentid;
            cnt--;
          }
          if (parentid === null) {
            categoriesMap[1].count = categoriesMap[1].count + count;
          }
        }
      }
    });

    let categoriesByParentLeft = _.filter(CategoriesData, item => item.parentid === Number(parentIdLeft));
    categoriesByParentLeft = _.map(categoriesByParentLeft, item => ({
      ...categoriesMap[item.id],
      left: true,
    }));

    let categoriesByParentRight = _.filter(CategoriesData, item => item.parentid === Number(parentIdRight));
    categoriesByParentRight = _.map(categoriesByParentRight, item => ({
      ...categoriesMap[item.id],
      right: true,
    }));

    const pathLeft = await get_category_path({ categoryId: parentIdLeft, categoriesMap });

    let pathRight;
    if (pathLeft !== pathRight) {
      pathRight = await get_category_path({ categoryId: parentIdRight, categoriesMap });
    } else {
      pathRight = pathLeft;
    }

    return {
      ok: true,
      data: {
        left: categoriesByParentLeft,
        right: categoriesByParentRight,
        pathLeft,
        pathRight,
        topIdLeft: categoriesMap[parentIdLeft].parentid,
        topIdRight: categoriesMap[parentIdRight].parentid,
        parentIdLeft,
        parentIdRight,
        attributesList,
        categoriesLeafs,
        attributesListMap,
      },
    };
  } catch (error) {
    console.error(error);
    res.status(400)
      .json({ error: { errors: [{ message: "Data errors!" }] } });
  }
};
