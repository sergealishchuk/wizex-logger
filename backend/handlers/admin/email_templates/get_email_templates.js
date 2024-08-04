const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Users, EmailTemplates } = require('../../../models');
const {
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

  try {

    const result = await EmailTemplates.findAll({
      order: [['index', 'ASC']],
    });

    return {
      ok: true,
      result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get email templates"),
        ERROR_CODE: "ERROR_GET_EMAIL_TEMPLATE"
      }
    );
  }
};
