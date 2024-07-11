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

  try {
    const result = await sequelize.transaction(async (t) => {
      const { articleTitle, description, tags } = body;

      const newArticle = await Articles.create(
        {
          title: articleTitle,
          body: description,
          tags: tags,
          authorId: UserID,
          lastEditorId: UserID,
          active: false,
          
        },
        {
          transaction: t,
        }
      );

      return {
        myResult: 'ok',
        newArticle,
      }
    });

    return {
      ok: true,
      SUCCESS_CODE: "SUCCESS_ADDED_ARTICLE",
      result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error add Article"),
        ERROR_CODE: "ERROR_CREATE_ARTICLE"
      }
    );
  }
};
