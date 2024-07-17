
const { Projects, ProjectActions, sequelize } = require('../../../models');
const jwt = require('jsonwebtoken');
const { socketConnector } = require('../../../utils');

module.exports = async (parameters, res) => {
  const { body, headers } = parameters;
  const { 'x-wizex': WizexToken, 'x-wizex-session-id': sessionId } = headers;

  const { JWT_SECRET_KEY } = process.env;

  let tokenPayload;

  try {
    tokenPayload = jwt.verify(WizexToken, JWT_SECRET_KEY);
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      message: 'Invalid token'
    }
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      let projectRequest;
      if (tokenPayload) {
        const { pi, apiKey } = tokenPayload;

        projectRequest = await Projects.findOne({
          where: {
            id: pi,
            apiKey,
          },
          raw: true,
        });

        const { active } = projectRequest;
        if (active) {
          const { message = 'empty', level = 'error' } = body;

          let content = '{}';
          try {
            content = JSON.stringify({ body, headers });
          } catch (e) { }

          await ProjectActions.create({
            projectId: pi,
            level,
            message,
            sessionId,
            content,
          },
            {
              transaction,
            })
        } else {
          return {
            ok: false,
            error: "The project is not active",
            ERROR_CODE: "PROJECT_NOT_ACTIVE"
          };
        }

        return {
          ok: true,
          projectId: pi,
        }
      }
    });

    if (result && result.ok) {
      const { projectId } = result;
      socketConnector.socketEmit({
        command: 'http.projectHasUpdated',
        params: {
          projectId,
        }
      });

      return {
        ...result,
      }
    } else if (result.error) {
      res.status(400).json(
        { ...result }
      );
      return
    }
  } catch (e) {
    console.log(e)
    return {
      ok: false,
      error: e,
    }
  }
}
