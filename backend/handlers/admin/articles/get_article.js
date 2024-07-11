const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Users, Articles, ArticlesTags, sequelize } = require('../../../models');
const { Op } = require("sequelize");
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../../utils');

module.exports = async (req, res, tokenPayload) => {
   const {
    params: { articleId },
  } = req;
  try {
    const result = await Articles.findOne({
      where: {
        id: articleId,
      },
      raw: true,
    });

    if (!result) {
      return {
        error: createErrorMessage("Article not found"),
        ERROR_CODE: 'ARTICLE_NOT_FOUND'
      };
    }

    const articlesTagsResult = await ArticlesTags.findAll({
      order: [['index', 'ASC']],
      raw: true
    });

    const articlesTagsMap = articlesTagsResult.length > 0
      ? Object.assign({}, ...articlesTagsResult.map(item => ({ [item.id]: item })))
      : {};

    const tagsStrings = [];
    const { tags } = result;
    _.each(tags, tagId => {
      const tagRecord = articlesTagsMap[tagId];
      if (tagRecord) {
        tagsStrings.push(tagRecord.name);
      }
    });

    return {
      ok: true,
      data: {
        ...result,
        tagsStrings,
      },
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get article"),
        ERROR_CODE: "ERROR_GET_ARTICLE"
      }
    );
  }
};
