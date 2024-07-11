const _ = require("lodash");
const { Categories, Attributes, sequelize } = require('../../../models');

module.exports = async (parameters = {}, res) => {
  const { attributes, where } = parameters;
  const attributesList = attributes
    ? attributes
    : ['id', 'parentid', 'index', 'name', 'nameen', 'path', 'leaf'];
  const whereOptions = where ? where : {};

  const CategoriesData = await Categories.findAll({
    order: [['id', 'ASC']],
    attributes: attributesList,
    where: whereOptions,
    raw: true,
  });

  const categoryAttributesList = await Attributes.findAll({
    attributes: ['categoryId'],
    group: ['categoryId'],
    raw: true,
  });
  const categoryAttributesListMap = _.map(categoryAttributesList, item => item.categoryId);

  const adjustCategories = _.includes(attributesList, 'parentid')
    ? _.map(CategoriesData, item => ({
      ...item,
      parentid: item.parentid === null ? null : Number(item.parentid),
      hasAttributes: categoryAttributesListMap.includes(item.id),
    }))
    : CategoriesData;

  const categoriesMap = Object.assign({}, ...adjustCategories.map(item => {
    return {
      [item.id]: item,
    }
  }));

  return {
    categories: adjustCategories,
    categoriesMap,
  };
};
