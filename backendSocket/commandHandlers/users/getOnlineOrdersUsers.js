const _ = require('lodash');
const { Op } = require("sequelize");
const { Orders } = require('../../../backend/models');

module.exports = async (params, tokenPayload) => {
  const { id: UserID } = tokenPayload;
  const { connections } = params;

  const users = Object.keys(connections).map(item => Number(item));
  try {
    const allUsersFromMyOrders = await Orders.findAll({
      where: {
        [Op.or]: [
          { sellerId: UserID },
          { userId: UserID },
        ]
      },
      attributes: ['sellerId', 'userId'],
      raw: true,
    });

    let allUsers = _.reduce(allUsersFromMyOrders, (res, record) => {
      res.push(record.sellerId);
      res.push(record.userId);
      return res;
    }, []);

    allUsers = _.uniq(allUsers).filter(item => item !== UserID);

    const onlineUsers = Object.assign({}, ...allUsers.map(item => {
      return {
        [item]: {
          online: users.includes(item),
        }
      }
    }));

    return {
      ok: true,
      data: {
        onlineUsers,
      },
    };
  } catch (e) {
    console.log('error', error);
  }
};
