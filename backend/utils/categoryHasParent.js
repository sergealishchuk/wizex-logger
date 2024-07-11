module.exports = (source, dest, categoriesMap) => {
  let current = source;
  while (current !== null) {
    if (current !== dest) {
      current = categoriesMap[current].parentid;
    } else {
      return true;
    }
  }
  return false;
};
