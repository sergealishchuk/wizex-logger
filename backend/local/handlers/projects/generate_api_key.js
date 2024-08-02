const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { ROLES } = require("../../../constants");
const { Users, Projects, sequelize } = require('../../../models');
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

  const { roles } = user;


  const { body = {} } = req;

  const { projectId } = body;

  try {
    const result = await sequelize.transaction(async (transaction) => {

      const projectRequest = await Projects.findOne({
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

      const apiKey = uuidv4();
      const token = jwt.sign(
        {
          id: UserID,
          pi: projectId,
          apiKey,
        },
        JWT_SECRET_KEY,
        { expiresIn: "622080000s" }
      );

      await Projects.update({
        apiKey,
        token,
      }, {
        transaction,
        where: {
          id: projectId,
        }
      });

      return {
        ok: true,
      }
    });

    if (result) {
      return result;
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error update project"),
        ERROR_CODE: "ERROR_UPDATE_PROJECT"
      }
    );
  }
};
