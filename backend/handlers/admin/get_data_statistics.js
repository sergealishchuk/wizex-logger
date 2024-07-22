const _ = require("lodash");
const { ROLES } = require("../../constants");
const { Users, sequelize } = require('../../models');
const {
  createErrorMessage,
} = require('../../utils');

module.exports = async (req, res, tokenPayload) => {
  const UserID = tokenPayload.id;
  console.log('tokenPayload', tokenPayload);
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

  if (!roles.includes(ROLES.ADMIN)) {
    res.status(400).json(
      {
        error: createErrorMessage("No permisions"),
        ERROR_CODE: "NO_PERMISSIONS"
      }
    );
    return;
  }

  const { body = {} } = req;

  return {
    ok: true,
    created: true,
    goods: {
      ProductCount: 0
    },
    indexCount: 0,
  };
};
