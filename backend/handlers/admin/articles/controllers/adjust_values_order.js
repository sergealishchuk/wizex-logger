const _ = require("lodash");
const { ArticlesTags } = require('../../../../models');

module.exports = async (parameters = {}) => {
  const { valuesListUpdate, transaction } = parameters;
  try {
    for (let index = 0; index < valuesListUpdate.length; ++index) {
      const value = valuesListUpdate[index];
      await ArticlesTags.update(
        {
          index: value.index,
        },
        {
          where: { id: value.id },
          transaction,
        }
      );
    }
  } catch (e) {
    console.log('error::::', e);
  }
};
