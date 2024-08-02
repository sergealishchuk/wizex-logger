
const { Projects, ProjectActions, sequelize } = require('../../../models');
const jwt = require('jsonwebtoken');
const { socketConnector } = require('../../../utils');

module.exports = async (parameters, res) => {
  const { body, headers } = parameters;
  const { 'x-wizex': WizexToken, 'x-wizex-session-id': sessionId, host } = headers;

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
console.log('host:', host);
console.log('projectRequest', projectRequest);
        const { active } = projectRequest;
        if (active) {
          const { message = 'empty', level = 'error' } = body;
          console.log('body:', body);
          const lastRecord = await ProjectActions.findAll({
            transaction,
            where: {
              projectId: pi,
              level,
              message,
            },
            attributes: ['id', 'projectId', 'message', 'level', 'count', 'content'],
            order: [['id', 'DESC']],
            limit: 1,
            raw: true,
          });

          let lastRecordTheSame = false;
          let counter;

          if (lastRecord && lastRecord.length > 0) {
            const { count, content } = lastRecord[0];

            let lastContent = '{}';
            try {
              lastContent = JSON.parse(content);
              const lastBody = lastContent.body;
              console.log('LASTBODY', JSON.stringify(lastBody));
              console.log('CURRENTBODY', JSON.stringify(body));
              if (JSON.stringify(lastBody) === JSON.stringify(body)) {
                counter = count;
                lastRecordTheSame = true;
              }
            } catch (e) { }
          }

          if (lastRecordTheSame) {
            const updateRecord = await ProjectActions.update({
              count: counter + 1,
              startedAt: new Date(),
            }, {
              where: {
                id: lastRecord[0].id
              },
              transaction,
            });
          } else {
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
              });
          }
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
};
