const _ = require("lodash");
const { ROLES, ARTICLES_SORT_VALUES } = require("../../../constants");
const { Users, Articles, ArticlesTags, sequelize } = require('../../../models');
const { Op } = require("sequelize");
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../../utils');
const { get_all_categories } = require('../../catalog/controllers');

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

  try {
    const { tags = [], sort = ARTICLES_SORT_VALUES.UPDATED_AT_DESC } = body;
    const articlesTagsResult = await ArticlesTags.findAll({
      order: [['index', 'ASC']],
      raw: true
    });

    const articlesTagsMap = articlesTagsResult.length > 0
      ? Object.assign({}, ...articlesTagsResult.map(item => ({ [item.id]: item })))
      : {};

    let order = [['updatedAt', 'DESC']];
    switch (sort) {
      case ARTICLES_SORT_VALUES.CREATED_AT_ASC:
        order = [['createdAt', 'ASC']];
        break;
      case ARTICLES_SORT_VALUES.CREATED_AT_DESC:
        order = [['createdAt', 'DESC']];
        break;
      case ARTICLES_SORT_VALUES.UPDATED_AT_ASC:
        order = [['updatedAt', 'ASC']];
        break;
      case ARTICLES_SORT_VALUES.UPDATED_AT_DESC:
        order = [['updatedAt', 'DESC']];
        break;
    };

    const articlesRequest = await Articles.findAll({
      order,
      raw: true,
    });

    let articles = articlesRequest;
    if (tags.length > 0) {
      articles = articles.filter(item => tags.some(el => item.tags.includes(el)));
    }

    const adjustResult = _.map(articles, item => ({
      ...item,
      tags: _.filter(_.map(item.tags, tag => articlesTagsMap[tag] && articlesTagsMap[tag].name), item => item),
    }));

    return {
      ok: true,
      articles: adjustResult,
      tags: articlesTagsResult,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get articles"),
        ERROR_CODE: "ERROR_GET_ARTICLES"
      }
    );
  }
};
