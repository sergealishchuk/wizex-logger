const _ = require("lodash");
const { ROLES } = require("../../../../constants");
const { Users, ArticlesTags, sequelize } = require('../../../../models');
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

  const {
    params: { tagId },
  } = req;

  try {

    const result = await ArticlesTags.findOne({
      where: {
        id: tagId,
      }
    });

    return {
      ok: true,
      result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get attribute value"),
        ERROR_CODE: "ERROR_GET_ATTRIBUTE_VALUE"
      }
    );
  }
};
