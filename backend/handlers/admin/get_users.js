
const _ = require("lodash");
const { Op } = require("sequelize");
const { ROLES } = require("../../constants");
const { Users } = require('../../models');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');

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

  const { id, email } = body;

  const condition = {};
  if (id) {
    condition.id = id;
  }
  if (email) {
    condition.email = {
      [Op.like]: `%${email}%`
    }
  }

  try {
    const usersList = await Users.findAll({
      where: condition,
      raw: true,
    });

    return {
      ok: true,
      data: {
        usersList,
      },
    };
  } catch (error) {
    res.status(400).json(
      {
        error: createErrorMessage("Error read Users List"),
        ERROR_CODE: "ERROR_READ_CURRENCY_LIST"
      }
    );
  }
};
