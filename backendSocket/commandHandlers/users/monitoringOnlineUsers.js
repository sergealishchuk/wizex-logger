const _ = require('lodash');
const { useReducedMotion } = require("framer-motion");
const { Op } = require("sequelize");
const { Users } = require('../../../backend/models');

module.exports = async (params, tokenPayload) => {
  const { id: UserID } = tokenPayload;
  const { connections } = params;

  const users = Object.keys(connections).map(item => Number(item));

  const userList = await Users.findAll({
    where: {
      id: { [Op.in]: users },
    },
    attributes: [
      'id',
      'firstname',
      'lastname',
      'country',
      'email'
    ],
    raw: true,
  });

  const userListFull = _.map(userList, user => {

    const userConnections = _.map(connections[user.id], conn => ({
      ...conn.data,
    }));

    return ({
      ...user,
      userConnections,
    })
  })

  return {
    ok: true,
    data: {
      userListFull,
    },
  };
};
