const _ = require("lodash");
const { ROLES, ARTICLES_SORT_VALUES } = require("../../../../constants");
const { Users, Articles, ArticlesTags, sequelize } = require('../../../../models');
const { Op } = require("sequelize");
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../../../utils');

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

  try {
    const articlesTagsResult = await ArticlesTags.findAll({
      order: [['index', 'ASC']],
      raw: true
    });

    const articlesTagsMap = articlesTagsResult.length > 0
      ? Object.assign({}, ...articlesTagsResult.map(item => ({ [item.id]: item })))
      : {};

    return {
      ok: true,
      tags: articlesTagsResult,
      tagsMap: articlesTagsMap,
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
