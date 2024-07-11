const _ = require("lodash");
const axios = require('axios');
const { ROLES } = require("../../constants");
const { Users, Goods, sequelize } = require('../../models');
const { Op } = require("sequelize");
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../utils');

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

  const { body } = req;
  const { count = 1, locale = 'en' } = body;

  const { currencyCode, digitalCode, rate, symbol, symbolFirst } = body;
  const timeStart = new Date().getTime();
  try {
    const result = await sequelize.transaction(async (t) => {

      let dummyData = [];
      try {
        dummyData = await axios.get(`http://192.168.0.108:3883/goods/${count}/?locale=${locale}`);
        dummyData = dummyData.data;
      } catch (e) {
        console.log('error', e);
      }

      let res = 'undefined';
      if (dummyData.length > 0) {
        const dummyAdjuct = _.map(dummyData, item => ({ ...item, detail: { description: '', attributes: item.attributes } }))

        try {
          res = await Goods.bulkCreate(
            dummyAdjuct,
            {
              transaction: t,
              include: [{
                association: Goods.Detail,
                as: 'detail'
              }]
            }
          );
        } catch (e) {
          console.log('my error:', e);
        }
      }

      return {
        created: true,
        SUCCESS_CODE: {
          name: "SUCCESS_ADDED_DUMMY_DATA",
          params: {
            time: `${(new Date().getTime() - timeStart) / 1000}`,
            count: res.length,
          }
        }
      };
    });

    return {
      ok: true,
      ...result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error add Currency"),
        ERROR_CODE: "ERROR_CREATE_CURRENCY"
      }
    );
  }
};
