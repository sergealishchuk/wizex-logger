const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Users, CICDProjects, sequelize } = require('../../../models');
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

  const fields = [
    'name',
    'description',
    'publicLink',
    'repoLink',
    'repoHook',
    'hookSecure',
    'localProjectPath',
    'branch',
    'localScriptsPath',
    'pm2name'
  ];

  const { body = {} } = req;

  const { ...restFields } = body;

  const fieldsValid = true;
  for (let index = 0; index < fields.length; ++index) {
    if (restFields[fields[index]] && restFields[fields[index]].length > 2) {
      continue;
    } else {
      fieldsValid = false;
      break;
    }
  }

  if (!fieldsValid || Object.keys(restFields).length !== fields.length) {
    res.status(400).json(
      {
        error: createErrorMessage("Validation error"),
        ERROR_CODE: "VALIDATION_ERROR"
      }
    );
    return;
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      await CICDProjects.create({
        ...restFields,
        active: false,
      }, {
        transaction,
      });

      return {
        ok: true,
      }
    });

    if (result) {
      return result;
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error update project"),
        ERROR_CODE: "ERROR_UPDATE_PROJECT"
      }
    );
  }
};
