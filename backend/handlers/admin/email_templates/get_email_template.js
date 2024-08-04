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

  const {
    params: { id },
  } = req;

  const idNumber = Number(id);

  try {

    const result = await EmailTemplates.findOne({
      where: {
        id: idNumber,
      },
      raw: true,
    });

    let emailTemplatesParams = {};
    
    try {
      emailTemplatesParams = JSON.parse(result.params);
    } catch(e) { };
     

    return {
      ok: true,
      result: {
        ...result,
      },
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get email template"),
        ERROR_CODE: "ERROR_GET_EMAIL_TEMPLATE"
      }
    );
  }
};
