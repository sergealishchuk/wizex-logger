const _ = require('lodash');
const { createErrorMessage } = require('../../../utils');
const { Articles, ArticlesTags, sequelize } = require('../../../models');
const { Op } = require("sequelize");

module.exports = async (req, res, tokenPayload) => {
  const { body = {} } = req;

  const { text = '', tags = [] } = body;

  try {
    const searchString = text.split(/\s+/g).join(' ');

    const findCondition = {
      published: true,
    };
    if (text.length > 0) {
      findCondition.title = {
        [Op.iLike]: `%${searchString}%`
      };
    }
    if (tags.length > 0) {
      findCondition.tags = {
        [Op.contains]: tags,
      };
    }

    const listResult = await Articles.findAll({
      where: findCondition,
      raw: true,
    });

    if (listResult.length > 0) {
      const articlesTagsResult = await ArticlesTags.findAll({
        order: [['index', 'ASC']],
        raw: true
      });

      const articlesTagsMap = articlesTagsResult.length > 0
        ? Object.assign({}, ...articlesTagsResult.map(item => ({ [item.id]: item })))
        : {};

      _.each(listResult, (item, index) => {
        listResult[index].tagsStr = _.map(item.tags, tag => articlesTagsMap[tag].name);
      })
    }

    return {
      ok: true,
      listResult,
    }
  } catch (e) {
    console.log('error:', e);
    res.status(400).json(
      { error: createErrorMessage("Error get categories.") }
    );
  }
};
