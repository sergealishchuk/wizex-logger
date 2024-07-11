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

  const { body = {} } = req;

  const {
    name,
    valueId,
  } = body;

  try {
    const result = await sequelize.transaction(async (t) => {

      const existRecord = await ArticlesTags.findOne({
        where: {
          id: valueId,
        },
        raw: true,
      });

      if (!existRecord) {
        return {
          error: createErrorMessage("Record not found"),
          ERROR_CODE: 'RECORD_NOT_FOUND'
        };
      }

      await ArticlesTags.update({
        name,
      }, {
        where: {
          id: valueId,
        },
        transaction: t,
      });

      return {
        updated: true,
        SUCCESS_CODE: "SUCCESS_UPDATED_TAG_VALUE"
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
        error: createErrorMessage("Error update Value"),
        ERROR_CODE: "ERROR_UPDATE_VALUE",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
