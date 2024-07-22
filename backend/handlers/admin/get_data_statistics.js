const _ = require("lodash");
const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');
const { ROLES } = require("../../constants");
const { Users, Goods, sequelize } = require('../../models');
const { Op } = require("sequelize");
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../utils');

// const client = new Client({
//   node: 'https://192.168.0.108:9200',
//   //node: 'https://workpc:9200',
//   auth: {
//     username: 'elastic',
//     password: 'oaEjYDNfmcFOZ-OIXSbV',
//   },
//   tls: {
//     ca: fs.readFileSync('handlers/search/certs/http_ca.crt'),
//     rejectUnauthorized: false,
//   }
// });

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

  const { currencyCode, digitalCode, rate, symbol, symbolFirst } = body;
  console.log('RETURN!!!');
  return {
    ok: true,
    created: true,
    goods: {
      ProductCount: 0
    },
    indexCount: 0,
  };

  try {
    const result = await sequelize.transaction(async (t) => {
      const goods = await Goods.findAll({
        where: {
          removed: false,
          temporaryLocked: false,
          locked: false,
          status: 1,
        },
        attributes: [[sequelize.fn('COUNT', 'id'), 'ProductCount']],
        raw: true,
      });

      return {
        created: true,
        goods: goods[0],
        SUCCESS_CODE: "SUCCESS_ADDED_CURRENCY"
      };
    });

    let indexCount = 0;

    const indexExists = await client.indices.exists({
      index: 'products',
    });
    if (indexExists) {
      indexCount = await client.search({
        "track_total_hits": true,
        index: 'products',
        size: 0,
      });
    }

    return {
      ok: true,
      ...result,
      indexCount: _.get(indexCount, 'hits.total.value', 0),
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
