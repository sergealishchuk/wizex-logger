const _ = require("lodash");
// const { ROLES } = require("../../../constants");
const { Users, Projects, sequelize } = require('../../../models');
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

  const { body = {} } = req;

  const { projectId, active } = body;

  try {
    const result = await sequelize.transaction(async (transaction) => {

      const projectRequest = await Projects.findOne({
        transaction,
        where: {
          id: projectId,
        },
        raw: true,
      });

      if (!projectRequest) {
        res.status(400).json(
          {
            error: createErrorMessage("Project not found"),
            ERROR_CODE: "PROJECT_NOT_FOUND"
          }
        );
        return;
      }

      await Projects.update({
        active,
      }, {
        transaction,
        where: {
          id: projectId,
        }
      });

      return {
        ok: true,
        data: {
          active,
        },
      }
    });

    if (result) {
      return result;
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error set project active"),
        ERROR_CODE: "ERROR_SET_PROJECT_ACTIVE"
      }
    );
  }
};
