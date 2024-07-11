const _ = require("lodash");
// const { ROLES } = require("../../../constants");
const { Users, CICDProjects, CICDBuilds } = require('../../../models');
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

  const { buildId } = body;

  try {

    const buildRequest = await CICDBuilds.findOne({
      where: {
        id: buildId,
      },
      attributes: ['id', 'projectId', 'branch', 'services', 'startedAt', 'commit', 'log', 'longTimeSec', 'status'],
      // order: [['id', 'DESC']],
      raw: true,
    });

    if (!buildRequest) {
      res.status(400).json(
        {
          error: createErrorMessage("Build not found"),
          ERROR_CODE: "BUILD_NOT_FOUND"
        }
      );
      return;
    }

    const { projectId } = buildRequest;

    const projectRequest = await CICDProjects.findOne({
      where: {
        id: projectId,
      },
      attributes: ['name', 'description', 'repoLink'],
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

    // const buildsRequest = await CICDBuilds.findAll({
    //   where: {
    //     projectId,
    //   },
    //   attributes: ['id', 'services', 'startedAt', 'commit', 'longTimeSec', 'status'],
    //   order: [['id', 'DESC']],
    //   raw: true,
    // });


    // const builds = _.map(buildsRequest, build => {
    //   let commit = {};
    //   try {
    //     commit = JSON.parse(build.commit);
    //   } catch (e) { console.log(e) };

    //   return {
    //     ...build,
    //     commit,
    //   }
    // });


    let commit = {};
    try {
      commit = JSON.parse(buildRequest.commit);
    } catch (e) { console.log(e) };

    const commitHash = commit.id ? commit.id.slice(0, 7) : '';
    const { name: projectName } = projectRequest;


    return {
      ok: true,
      data: {
        // project: projectRequest,
        // builds,
        buildId,
        projectId,
        commitHash,
        projectName,
        commit,
        buildRecord: buildRequest,
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
