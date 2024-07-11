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

  const {
    params: { articleId },
  } = req;

  const articleIdNumber = Number(articleId);

  try {
    const result = await sequelize.transaction(async (transaction) => {

      const existArticle = await Articles.findOne({
        where: {
          id: articleIdNumber,
        },
        raw: true,
      });

      if (!existArticle) {
        return {
          error: createErrorMessage("Article not found"),
          ERROR_CODE: 'ARTICLE_NOT_FOUND'
        };
      }

      await Articles.destroy({
        transaction,
        where: {
          id: articleIdNumber,
        },
      });


      return {
        removed: true,
        SUCCESS_CODE: "SUCCESS_REMOVE_ARTICLE"
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
        error: createErrorMessage("Error remove Article"),
        ERROR_CODE: "ERROR_REMOVE_ARTICLE",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
