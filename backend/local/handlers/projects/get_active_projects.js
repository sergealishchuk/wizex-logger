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

  try {

    const projectsListRequest = await Projects.findAll({
      where: {
        active: true,
      },
      attributes: ['id', 'name', 'publicLink'],
      order: [['name', 'ASC']],
      raw: true,
    });

    // const projectList = [];

    // for (let index = 0; index < projectsListRequest.length; ++index) {
      
    //   const {id: projectId} = projectsListRequest[index];

    //   const buildsRequest = await ProjectActions.findOne({
    //     where: {
    //       projectId,
    //     },
    //    // attributes: ['id', 'status'],
    //     order: [['id', 'DESC']],
    //     raw: true,
    //   });

    //   projectList.push({
    //     ...projectsListRequest[index],
    //     status: buildsRequest ? buildsRequest.status : 3,
    //   });
    // }

    return {
      ok: true,
      data: {
        projects: projectsListRequest,
      },
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get projects"),
        ERROR_CODE: "ERROR_GET_PROJECTS"
      }
    );
  }
};
