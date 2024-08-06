const path = require('path');

const { CICDProjects, CICDBuilds, sequelize } = require('../models');
const { socketConnector } = require('../utils');

module.exports = async (req) => {
  try {
    const result = await sequelize.transaction(async (transaction) => {
      const { body: { ref, repository: { url }, head_commit } } = req;
      console.log('ref:', ref);
      console.log('url:', url);
      console.log('commit:', head_commit);
      console.log('---------------------------');
      const project = await CICDProjects.findOne({
        transaction,
        where: {
          active: true,
          branch: ref,
          repoLink: url,
        },
        raw: true,
      });

      if (project) {
        const { id: projectId, branch, config, localScriptsPath } = project;

        const listInProccess = await CICDBuilds.findAll({
          where: {
            projectId,
            status: 0,
          },
          transaction,
          attributes: ['id', 'startedAt'],
          raw: true,
        });

        for (let index = 0; index < listInProccess.length; ++index) {
          const buildRecord = listInProccess[index];
          const { id, startedAt } = buildRecord;
          await CICDBuilds.update({
            status: 3,
            longTimeSec: Number(((new Date().getTime() - new Date(startedAt).getTime()) / 1000).toFixed(0)),
          }, {
            where: {
              id,
            },
            transaction,
          });
        }

        const newCommit = await CICDBuilds.create(
          {
            projectId,
            branch,
            commit: JSON.stringify(head_commit),
          },
          {
            transaction,
            raw: true,
          },
        );

        const buildScript = path.resolve(path.dirname(require.main.filename), `${localScriptsPath}/build.js`);
        const script = require(buildScript);
        const { id: buildId, startedAt } = newCommit; 
        if (script) {
          res = script(project, {
            buildId,
            startedAt,
          });
        }

      }

      return {
        ok: true,
      }
    });

    if (result) {
      console.log('send from backend to socket - http.buildHasUpdated');
      socketConnector.socketEmit({
        command: 'http.buildHasUpdated',
      });
    }
  } catch (e) {
    console.log(e);
  };
}
