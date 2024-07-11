import { _ } from '~/utils';

export default (catalog, list) => {
  const orderedCatalog = [];

  const catalogMap = Object.assign({}, ...catalog.map(item => {
    return {
      [item.id]: item,
    }
  }));

  const getPath = (id, res = []) => {
    if (catalogMap[id]) {
      res.push(id);
      return (id === 1 ? res : [...getPath(catalogMap[id].parentid), ...res]);
    }
  };

  const getAllLeafsIds = (id) => {
    const arr = _.filter(catalog, item =>
      (item.parentid === id));
    return arr.reduce((acc, curr) => {
      return acc.concat(
        !curr.leaf
          ? getAllLeafsIds(curr.id)
          : curr
      )
    }, []);
  }

  const hasLeaf = (id) => {
    if (catalogMap[id].leaf) {
      return true;
    }
    const list = catalog.filter(item => item.parentid === id);
    for (let index = 0; index < list.length; ++index) {
      const item = list[index];
      if (!item.leaf) {
        return hasLeaf(item.id);
      } else {
        return true;
      }
    };

    return false;
  };

  const getChildren = (id) => {
    const list = catalog.filter(item => item.parentid === id).sort((a, b) => a.index - b.index);
    if (list.length > 0) {
      list.map(item => {
        orderedCatalog.push({ ...catalogMap[item.id] });
        return getChildren(item.id)
      })
    }
  };

  getChildren(null);

  const listAdjusted = {};

  _.each(list, item => {
    if (item.leaf) {
      listAdjusted[item.id] = true;
    } else {
      const leafs = getAllLeafsIds(item.id);
      if (leafs.length > 0) {
        _.each(leafs, leaf => {
          listAdjusted[leaf.id] = true;
        })
      }
    }
  });

  const filteredCatalog = _.filter(orderedCatalog, item => listAdjusted[item.id]);
  const groups = _.groupBy(filteredCatalog, 'parentid');

  const result = {};
  _.map(Object.keys(groups), groupId => {
    const groupPath = getPath(Number(groupId));
    if (groupPath && _.isArray(groupPath) && groupPath.length > 1) {
      const mainCategory = Number(groupPath[1]);
      if (!result[mainCategory]) {
        result[mainCategory] = {
          main: catalogMap[mainCategory],
          children: [],
        }
      }
      result[mainCategory].children.push({
        path: groupPath,
        children: groups[groupId],
      })
    }
  });

  return Object.values(result);
};
