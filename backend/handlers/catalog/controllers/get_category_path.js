
const _ = require("lodash");
const { Categories } = require('../../../models');

const getCategoryPath = (id, categoriesMap) => {
  const path = [];
  let current = categoriesMap[id];
  while (current && current.parentid && Number(current.parentid) > 0) {
    path.push(current.parentid);
    current = categoriesMap[current.parentid];
  }
  return [...path.reverse(), id];
};

module.exports = async (parameters = {}, res) => {
  const { categoryId, categoriesMap: categoriesMapInput } = parameters;

  let categoriesMap;
  if (!_.isEmpty(categoriesMapInput)) {
    categoriesMap = categoriesMapInput;
  } else {
    const CategoriesData = await Categories.findAll({
      attributes: ['id', 'parentid', 'name', 'nameen'],
      raw: true,
    });

    categoriesMap = Object.assign({}, ...CategoriesData.map(item => {
      return {
        [item.id]: item,
      }
    }));
  }

  const path = getCategoryPath(Number(categoryId), categoriesMap).map(item => categoriesMap[item]);
  return path;
};
