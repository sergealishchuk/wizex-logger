const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Users, Projects, ProjectActions, sequelize } = require('../../../models');
const {
  createErrorMessage,
} = require('../../../utils');
const { check_access_to_project } = require('../__controllers');

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

  const { projectId } = body;

  const ProjectAccess = await check_access_to_project({
    projectId,
    userId: UserID
  });
  const { access } = ProjectAccess;
  if (!access) {
    res.status(400).json(
      {
        error: createErrorMessage("No permisions"),
        ERROR_CODE: "NO_PERMISSIONS"
      }
    );
    return;
  }

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

      await Projects.destroy({
        transaction,
        where: {
          id: projectId,
        }
      });

      await ProjectActions.destroy({
        transaction,
        where: {
          projectId,
        }
      })

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
        error: createErrorMessage("Error delete project"),
        ERROR_CODE: "ERROR_DELETE_PROJECT"
      }
    );
  }
};
