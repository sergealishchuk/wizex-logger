const _ = require("lodash");

module.exports = (parameters, res) => {
  const { categoryList } = parameters;

  const getLeafsByCategory = (id, leafs = []) => {
    const list = categoryList.filter(item => item.parentid === id)
      .sort((a, b) => a.index - b.index);
    if (list.length > 0) {
      list.map((item, ndx) => {
        list[ndx].index = ndx;
        if (item.leaf) leafs.push(item.id);
        return getLeafsByCategory(item.id, leafs);
      })
    }
    return leafs;
  };

  const categories = [];

  _.each(categoryList, (category, index) => {
    categories.push({
      ...categoryList[index],
    });
  });

  return categories;
};
