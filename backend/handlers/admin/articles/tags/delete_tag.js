const _ = require("lodash");
const { ROLES } = require("../../../../constants");
const { Users, ArticlesTags, sequelize } = require('../../../../models');
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

  const {
    params: { valueId },
  } = req;

  const valueIdNumber = Number(valueId);

  try {
    const result = await sequelize.transaction(async (transaction) => {

      const existValue = await ArticlesTags.findOne({
        where: {
          id: valueId,
        },
        raw: true,
      });

      if (!existValue) {
        return {
          error: createErrorMessage("Value not found"),
          ERROR_CODE: 'VALUE_NOT_FOUND'
        };
      }

      await ArticlesTags.destroy({
        transaction,
        where: {
          id: valueId,
        },
      });

      return {
        removed: true,
        SUCCESS_CODE: "SUCCESS_REMOVE_TAG_VALUE",
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
        error: createErrorMessage("Error remove Value"),
        ERROR_CODE: "ERROR_REMOVE_VALUE",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
