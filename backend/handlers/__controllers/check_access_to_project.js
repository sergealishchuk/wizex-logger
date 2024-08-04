
const { Projects } = require('../../models');

module.exports = async (parameters = {}) => {
  const { userId, projectId } = parameters;

  const projectRequest = await Projects.findOne({
    where: {
      id: projectId,
      [Op.or]: {
        ownerId: userId,
        AccessIsAllowed: {
          [Op.contains]: [userId],
        }
      }
    },
    raw: true,
  });

  let owner = false;
  if (projectRequest) {
    owner = projectRequest.ownerId === userId;
  }

  return {
    access: Boolean(projectRequest),
    owner,
    projectId,
  }
};
