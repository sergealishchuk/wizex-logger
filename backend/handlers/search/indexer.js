const _ = require('lodash');
const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');
const { ROLES } = require("../../constants");
const { Users, Goods, Detail, ExchangeRates, AttributesValue, sequelize } = require('../../models');
const { get_all_categories } = require('../catalog/controllers');
const { createErrorMessage } = require('../../utils');

const getRandomArrElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
};

const client = new Client({
  node: 'https://192.168.0.108:9200',
  //node: 'https://workpc:9200',
  auth: {
    username: 'elastic',
    password: 'oaEjYDNfmcFOZ-OIXSbV',
  },
  tls: {
    ca: fs.readFileSync('handlers/search/certs/http_ca.crt'),
    rejectUnauthorized: false,
  }
});

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

  const { text } = body;

  const timeStart = new Date().getTime();

  const indexExists = await client.indices.exists({
    index: 'products',
  });

  console.log('indexExists ', indexExists);

  if (indexExists) {
    const removeIndexes = await client.indices.delete({
      index: ['products']
    });
    console.log('OK delete index');
  }

  await client.indices.create({
    index: 'products'
  });

  console.log('index has been created');

  await client.indices.putMapping({
    "index": "products",
    "body": {
      "properties": {
        "priceUSD": {
          "type": "float"
        },
        "currencyCode": {
          "type": "keyword"
        },
        "name": {
          "type": "text"
        }
      }
    }
  });
  console.log('OK create index and mapping');

  try {

    const indexProducts = async (datasource) => {
      const result = await client.helpers.bulk({
        datasource,
        onDocument(doc) {
          return {
            index: { _index: 'products' }
          }
        },
        onDrop(doc) {
          console.log('can\'t index document', doc.error);
          return {
            error: doc.error,
          }
        },
        refreshOnCompletion: 'products'
      })
    };

    const productsData = await Goods.findAll({
      where: {
        removed: false,
        temporaryLocked: false,
        locked: false,
        status: 1,
      },
      include: [
        {
          model: Detail,
          as: 'detail',
          attributes: ['attributes'],
        }
      ],
      attributes: ['id', 'categoryId', 'name', 'price', 'currencyCode'],
      raw: true,
    });

    // TODO: Now we are normalizing only UAH, but in feature we need do it for all currencies
    const CurrencyUSD = await ExchangeRates.findOne({
      where: {
        currencyCode: 'USD',
      },
      raw: true,
    });

    const rateUSD = Number(CurrencyUSD.rate);

    const adjuctProductsData = _.map(productsData, product => ({
      ..._.omit(product, 'detail.attributes'),
      priceUSD: product.currencyCode === 'UAH' ? product.price / rateUSD : product.price,
      attributes: product['detail.attributes'] ? JSON.parse(product['detail.attributes']) : {},
    }));

    const indexResult = await indexProducts(adjuctProductsData);
    return {
      ok: true,
      productsDataLength: productsData.length,
      SUCCESS_CODE: {
        name: "SUCCESS_INDEXED_PRODUCTS",
        params: {
          time: `${(new Date().getTime() - timeStart) / 1000}`,
          count: productsData.length
        }
      }
    }

  } catch (e) {
    console.log('error', e);
    res.status(400).json(
      { error: createErrorMessage("Error indexer.") }
    );
  }
};
