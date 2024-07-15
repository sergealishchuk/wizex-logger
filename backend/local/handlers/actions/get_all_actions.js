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

  const { projectId, f, includeBuilds = true } = body;

  try {

    const projectRequest = await Projects.findOne({
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

   
    const ownerRequest = await Users.findOne({
      where: {
        id: projectRequest.ownerId,
      },
      attributes: ['firstname', 'lastname'],
      raw: true,
    });
    const { firstname, lastname } = ownerRequest;

    const ownerName = `${firstname} ${lastname}`;

    const data = {
      project: {
        ...projectRequest,
        ownerName,
      }
    };

    if (includeBuilds) {
      const where = { projectId };
      if (f) {
        where.sessionId = f;
      }
      const actionsRequest = await ProjectActions.findAll({
        where,
        order: [['id', 'DESC']],
        raw: true,
      });

      const actions = _.map(actionsRequest, action => {
        let content = {};
        try {
          content = JSON.parse(action.content);
        } catch (e) { console.log(e) };

        return {
          ...action,
          body: content.body,
          headers: content.headers,
        }
      });

      data['actions'] = actions;
    }

    return {
      ok: true,
      data,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get project info"),
        ERROR_CODE: "ERROR_GET_PROJECT_INFO"
      }
    );
  }
};
