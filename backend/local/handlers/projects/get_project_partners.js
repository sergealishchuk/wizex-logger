const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { Users, Projects, sequelize } = require('../../../models');
const { Op } = require("sequelize");
const {
  createErrorMessage,
} = require('../../../utils');

const { JWT_SECRET_KEY } = process.env;

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

      const projectRequest = await Projects.findOne({
        where: {
          id: projectId,
          ownerId: UserID,
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

      const { AccessIsAllowed } = projectRequest;

      const partnersListRequest = await Users.findAll({
        where: {
          id: {
            [Op.in]: AccessIsAllowed,
          },
        },
        attributes: ['id', 'firstname', 'lastname', 'email'],
        raw: true,
      });

      const partnersList = _.map(partnersListRequest, item => ({
        id: item.id,
        name: `${item.firstname} ${item.lastname}`,
        email: item.email,
      }));

      return {
        ok: true,
        partnersList,
      }
    });

    if (result) {
      return result;
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error get partners"),
        ERROR_CODE: "ERROR_GET_PARTNERS"
      }
    );
  }
};
