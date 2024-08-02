const _ = require("lodash");
const { Users, Projects, ProjectActions } = require('../../../models');
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

  const { actionId } = body;

  try {

    const actionRequest = await ProjectActions.findOne({
      where: {
        id: actionId,
      },
      raw: true,
    });
console.log('actionRequest', actionRequest);
    if (!actionRequest) {
      res.status(400).json(
        {
          error: createErrorMessage("Action not found"),
          ERROR_CODE: "ACTION_NOT_FOUND"
        }
      );
      return;
    }

    const { projectId } = actionRequest;

    const projectRequest = await Projects.findOne({
      where: {
        id: projectId,
      },
      attributes: ['name', 'description', 'publicLink'],
      raw: true,
    });
console.log('projectRequest', projectRequest);
    if (!projectRequest) {
      res.status(400).json(
        {
          error: createErrorMessage("Project not found"),
          ERROR_CODE: "PROJECT_NOT_FOUND"
        }
      );
      return;
    }

    let content = {};
    try {
      content = JSON.parse(actionRequest.content);
    } catch (e) { console.log(e) };

    const { name: projectName } = projectRequest;
console.log('content', content);

    return {
      ok: true,
      data: {
        actionId,
        projectId,
        projectName,
        body: content.body,
        headers: content.headers,
        actionRecord: actionRequest,
        project: projectRequest,
      },
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get build detail"),
        ERROR_CODE: "ERROR_GET_BUILD_DETAIL"
      }
    );
  }
};
