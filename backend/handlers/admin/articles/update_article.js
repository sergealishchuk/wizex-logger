const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Users, Articles, sequelize } = require('../../../models');
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../../utils');

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

  const {
    articleId,
    articleTitle,
    description,
    tags,
  } = body;

  try {
    const result = await sequelize.transaction(async (t) => {

      const existArticle = await Articles.findOne({
        where: {
          id: articleId,
        },
        raw: true,
      });

      if (!existArticle) {
        return {
          error: createErrorMessage("Article not found"),
          ERROR_CODE: 'ARTICLE_NOT_FOUND'
        };
      }

      const updateResult = await Articles.update({
        titleEdited: articleTitle,
        bodyEdited: description,
        tagsEdited: tags,
        lastEditorId: UserID,
        editedAt: new Date(),
      }, {
        where: {
          id: articleId,
        },
        transaction: t,
      });

      return {
        updated: true,
        updateResult,
        SUCCESS_CODE: "SUCCESS_UPDATED_ARTICLE"
      };
    });

    return {
      ok: true,
      ...result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error update Article"),
        ERROR_CODE: "ERROR_UPDATE_ARTICLE",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
