const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
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

  const { body = {} } = req;

  const { email, projectId } = body;

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

      const partnerRequest = await Users.findOne({
        where: {
          email
        },
        raw: true,
      });

      if (!partnerRequest) {
        res.status(400).json(
          {
            error: createErrorMessage("Partner not found"),
            ERROR_CODE: "PARTNER_NOT_FOUND_IN_THE_LIST"
          }
        );
        return;
      }

      const { id: partnerId } = partnerRequest;


      if (UserID === partnerId) {
        res.status(400).json(
          {
            error: createErrorMessage("Trying to add yourself to partners"),
            ERROR_CODE: "YOURSALF_AS_PARTNER"
          }
        );
        return;
      }


     // const accessList = [1];
      const { AccessIsAllowed } = projectRequest;

      console.log('JSON', JSON.stringify(AccessIsAllowed));
      console.log('partnerId', partnerId, typeof(partnerId))

      if (AccessIsAllowed.includes(partnerId)) {
        res.status(400).json(
          {
            error: createErrorMessage("Partner present in the list"),
            ERROR_CODE: "PARTNER_ADDED_BEFORE"
          }
        );
        return;
      }



      await Projects.update({
        AccessIsAllowed: [...AccessIsAllowed, partnerId],
      }, {
        transaction,
        where: {
          id: projectId,
          ownerId: UserID,
        }
      });


      return {
        ok: true,
        partnerId,
        AccessIsAllowed,
      }
    });

    if (result) {
      return result;
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error add partner"),
        ERROR_CODE: "ERROR_ADD_PARTNER"
      }
    );
  }
};
