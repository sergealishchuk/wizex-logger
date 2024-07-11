const _ = require('lodash');

module.exports = (categoryIdValue, allCategories = []) => {
  const categoriesByChildren = {};
  const categoryId = Number(categoryIdValue);

  _.each(
    _.groupBy(allCategories, 'parentid'),
    (item, key) => (categoriesByChildren[key] = item.map(categoryItem => categoryItem.id))
  );

  const findCategory = _.find(allCategories, item => item.id === categoryId);
  if (!findCategory) {
    return [];
  } else if (!Array.isArray(categoriesByChildren[categoryId])) {
    return [categoryId];
  } else {
    const getChildren = (id) => categoriesByChildren[id].reduce((acc, curr) =>
      acc.concat(
        Array.isArray(categoriesByChildren[curr])
          ? [curr, ...getChildren(curr)]
          : curr),
      []
    );
    return [categoryId, ...getChildren(categoryId)];
  }
};
