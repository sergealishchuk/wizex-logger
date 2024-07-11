const _ = require("lodash");
const { ROLES } = require("../../../../constants");
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

  const { body = {} } = req;

  const {
    valueId,
  } = body;

  const tagIdNumber = Number(valueId);

  try {

    const result = await sequelize.transaction(async (transaction) => {
      const existTag = await ArticlesTags.findOne({
        where: {
          id: tagIdNumber,
        },
        raw: true,
      });

      if (!existTag) {
        return {
          error: createErrorMessage("Tag not found"),
          ERROR_CODE: 'TAG_NOT_FOUND'
        };
      }

      const findArticlesWithThisTag = await Articles.findAll({
        where: {
          tags: {
            [Op.contains]: [tagIdNumber]
          }
        },
        raw: true,
      });

      return {
        checked: true,
        tagsCounter: findArticlesWithThisTag.length,
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
        error: createErrorMessage("Error check Attribute"),
        ERROR_CODE: "ERROR_CHECK_ATTRIBUTE",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
