const _ = require("lodash");
// const { ROLES } = require("../../../constants");
const { Users, CICDProjects, sequelize } = require('../../../models');
const path = require('path');
const {
  runCommand,
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

  const { projectId } = body;

  try {
    const result = await sequelize.transaction(async (transaction) => {

      const projectRequest = await CICDProjects.findOne({
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

      const { localProjectPath, branch, active } = projectRequest;

      if (!active) {
        res.status(400).json(
          {
            error: createErrorMessage("Project not active"),
            ERROR_CODE: "PROJECT_NOT_ACTIVE"
          }
        );
        return;
      }

      const stringOut = [];
      const pushData = (string) => stringOut.push(string);
  
      const onScriptStart = (params) => {
        console.log('onScriptStart');
      };
  
      const onScriptFinal = async (code) => {
        console.log('onScriptFinal: ', code);
      };

      const branchShort = branch.replace(/^refs\/heads\//, '');
      const scriptFile = path.resolve(__dirname, 'pushEmptyCommit.sh');
      console.log('projectId, localProjectPath', projectId, localProjectPath);
      console.log('branchShort:', branchShort);
      console.log('scriptFile:', scriptFile);
      
      const options = [
        '-b',
        branchShort,
        '-l',
        localProjectPath,
      ];

      await runCommand({
        command: scriptFile,
        args: options,
        onData: pushData,
        onStart: onScriptStart,
        onFinish: onScriptFinal,
      });

      return {
        ok: true,
        data: {
          projectId,
        },
      }
    });

    if (result) {
      return result;
    }
  } catch (e) {
    console.log('EEEEEEEEE:', e);
    res.status(400).json(
      {
        error: createErrorMessage("Error push empty commit"),
        ERROR_CODE: "ERROR_PUSH_EMPTY_COMMIT",
        e,
        eString: `${e.toString()}`,
      }
    );
  }
};
