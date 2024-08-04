const _ = require("lodash");
// const { ROLES } = require("../../../constants");
const { Op } = require("sequelize");
const { Users, Projects } = require('../../../models');
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
        [Op.or]: {
          ownerId: UserID,
          AccessIsAllowed: {
            [Op.contains]: [UserID],
          }
        }
      },
      order: [['name', 'ASC']],
      raw: true,
    });

    const projectsList = _.map(projectsListRequest, item => ({
      ..._.pick(item, ['id', 'name', 'ownerId', 'publicLink']),
      mine: item.ownerId === UserID,
    }))

    return {
      ok: true,
      data: {
        projects: projectsList,
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
