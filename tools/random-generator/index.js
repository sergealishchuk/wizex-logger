// Requiring module
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config({ path: '../.env' });
const { APP_ENV, JWT_SECRET_KEY } = process.env;
global.APP_ENV = APP_ENV || 'development';
console.log('Environment: ', global.APP_ENV);

const { Users, Goods, Detail, ExchangeRates, Attributes, AttributesValue, sequelize } = require('../../backend/models');
const { get_all_categories } = require('../../backend/handlers/catalog/controllers');


// Creating express object
const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

let AttributesByCategoryMap = {};
let AttributeValueList = {};
let LeafList = [];

const getRandomMoney = (range) => {
  const value = ((range[1] - range[0]) * 100 * Math.random()) / 100 + range[0];
  return Number(Number(value).toFixed(2));
};

const en_str_source = "Cessation of existence is usually decreed at the dispensational or epochal adjudication of the realm or realms On a world such as Urantia it comes at the end of a planetary dispensation Cessation of existence can be decreed at such times by co-ordinate action of all tribunals of jurisdiction extending from the planetary council up through the courts of the Creator Son to the judgment tribunals of the Ancients of Days The mandate of dissolution originates in the higher courts of the superuniverse following an unbroken confirmation of the indictment originating on the sphere of the wrongdoers residence and then when sentence of extinction has been confirmed on high the execution is by the direct act of those judges residential on and operating from the headquarters of the superuniverse";
const en_str_arr = en_str_source.split(' ').map(item => item.toLowerCase()).filter(item => item.length > 1);

const img_url = "https://storage.dsshub.net/img/aoks/products/1/";
const imgs_arr_source = "087d1bc2-f154-4206-b242-91b154faf126.jpeg  58dfebc2-0bf0-4a3a-8dd0-63a514ba5a9d.jpeg  a4bd00fc-1697-4513-b3ca-7986724a83bf.jpeg 0881add7-c1d6-4800-8f57-64c485517d45.jpeg  5d3837d3-30ec-4ad8-baf0-d499d50864f9.jpeg  a547fb37-4d32-4cbc-a0ec-8dbfa3987e02.jpeg 0e95edb4-399c-4f08-adc3-524801b970a2.jpeg  67e980f5-37c4-484a-903f-4c7424f20170.jpeg  ac0a3e6e-97b3-45a2-9eaf-7eddbef3889f.jpeg 1187b2cd-f46e-4688-aecb-3b01422667ea.jpeg  68976514-1fd3-4fd6-a577-b93de1c53266.jpeg  acd0ba56-119d-4c80-9954-8f5a752c34cf.jpeg 14967375-c0a1-4978-b2c2-aca1c649cbf9.jpeg  6a40bbf5-b40c-4f1b-bad3-6722e43f689a.jpeg  adee8bbe-a8f2-4ae6-ad5d-a1fdca6878d0.jpeg 14eaae2e-3501-4cdb-bb47-bb2461797236.jpeg  6dc728dd-1b98-4ebd-9dd7-0966e8ce1a9d.jpeg  ba27494e-48b0-458c-9d03-181050362ce7.jpeg 16ecf963-61dc-4244-bf6b-c6c5371c0124.jpeg  706dad24-e4b1-49ac-b87c-7683459a4c17.jpeg  ba303225-063b-494e-b55f-17fa9f0b0865.jpeg 1cf60929-f978-4de8-a7b4-6e5b4f7d30fe.jpeg  72e98b31-d673-4268-9db7-3c4b64e3ba7f.jpeg  bc9f416c-246c-42d9-bcb9-8ea423ece2c7.jpeg 1cfcbd2e-564e-420e-b2a7-1d0d17d66d22.png   73c3c49f-90cf-4ed9-981d-ae8ce428f16d.jpeg  bfba8fb1-55fb-4b66-b48c-50e5039d2d98.jpeg 21ad96cb-ac50-4075-b672-7b6d9bfb2e08.jpeg  8551992a-81b6-4cf0-9751-627e39ee6206.png   c2506b49-29d1-462f-9569-ad8e86bdb77e.jpeg 24b8a631-4317-4584-8419-aebd7b28bafa.jpeg  8ad25e96-34d8-48d6-b98f-775080c804a9.jpeg  ca3ba4e2-59ba-44d1-915c-cd536e0f7cae.jpeg 42e54330-e43b-4813-b541-3cd454135a09.jpeg  964fb487-c88a-4729-a9fb-1c551fde3f41.jpeg  d17a1884-0a63-4818-98fa-8783e6458728.jpeg 44762684-1a2d-4170-bb0d-0d8d41412dc0.jpeg  992c5002-6948-4c1a-a290-0ab1a25ec138.jpeg  d5148a7b-0c6e-43ac-b5f2-59e5b655b304.jpeg 466a0e0d-1c1e-4796-be0d-dc7c7de6c669.jpeg  99ddfeb7-e41e-4df5-b213-4da4e3dec8a7.jpeg  df6fa96a-2154-41bf-bfe0-d75c83fafee3.jpeg 46744073-100f-440c-9f1a-9e1b360a90ed.png   9b3d7162-2d93-4bed-9b1b-f7801aa4ddd1.jpeg  f53b64a3-0b04-4e8d-9f95-a71741947fdd.jpeg 49451db5-789a-405b-9845-93dca927fee5.jpeg  9cd6955a-a77d-41eb-9ae7-c352cd735626.jpeg 50863f34-6b89-4d5f-ad47-47b85f040c58.jpeg  9e0e0cac-d59e-4265-a86f-5ea6a58e8142.jpeg";
const imgs_arr = imgs_arr_source.split(' ').filter(item => item.length > 3);
const imgs_count = imgs_arr.length;

const uk_str_source = "Нам з Катрею було життя вільне бо батьку ніколи було нас стерегти чи робимо ми гуляємо а мати у матері було одпросимось коли схочемо забаримося то вона за нас діло наше поробить а нас тільки спита А що чи добре гуляли";
const uk_str_arr = uk_str_source.split(' ').map(item => item.toLowerCase()).filter(item => item.length > 1);

const getRandomArr = (arr, length) => {
  const random_sorted_arr = arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const res = random_sorted_arr.slice(0, length);
  return res;
}

const getRandomStr = (length, locale = 'en') => {
  const random_sorted_str = (locale === 'uk' ? uk_str_arr : en_str_arr)
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  const res = _.uniq(random_sorted_str).join(' ').slice(0, length);
  return res.charAt(0).toUpperCase() + res.slice(1);
}
// Defining port number
const PORT = 3883;

const DataType = {
  INTEGER: 'integer',
  STRING: 'string',
  ARRAY: 'array',
  ENUM: 'enum',
  DATE: 'date',
  MONEY: 'money',
  PRODUCT_ATTRIBUTES: 'product_attributes'
}

const products = () => ({
  categoryId: {
    type: DataType.INTEGER,
    set: LeafList,
  },
  name: {
    type: DataType.STRING,
    length: [20, 200]
  },
  path: {
    type: DataType.ARRAY,
    of: DataType.STRING,
    set: imgs_arr,
    prefix: img_url,
    length: [1, 12]
  },
  currencyCode: {
    type: DataType.ENUM,
    set: ['USD', 'UAH']
  },
  status: {
    type: DataType.INTEGER,
    value: 1,
  },
  UserId: {
    type: DataType.INTEGER,
    range: [1, 3]
  },
  price: {
    type: DataType.MONEY,
    range: [12, 10000],
  },
  attributes: {
    type: DataType.PRODUCT_ATTRIBUTES,
  }
});

const getRandomValue = (range) => {
  return range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));
};

const getRandomArrElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
};

const getRandomAttributes = (obj) => {
  const { categoryId } = obj;

  const attrList = AttributesByCategoryMap[categoryId];
  if (attrList) {
    const attrStructure = {};
    const res = _.map(attrList, attrId => {
      if (_.isArray(AttributeValueList[attrId]) && AttributeValueList[attrId].length > 0) {
        attrStructure[attrId] = getRandomArrElement(AttributeValueList[attrId]);
      }
    })
    return JSON.stringify(attrStructure);
  }

  return `{}`
};

const generate = (structure, count, locale) => {
  const result = [];
  for (let i = 0; i < count; ++i) {
    const obj = {};
    for (var fieldName in structure) {
      const entity = structure[fieldName];
      const { value, range, set, length, of } = entity;
      switch (entity.type) {
        case DataType.INTEGER:
          if (!_.isUndefined(value)) {
            obj[fieldName] = value;
          } else if (!_.isUndefined(range)) {
            const valueRange = getRandomValue(range);
            obj[fieldName] = valueRange;
          } else if (!_.isUndefined(set)) {
            obj[fieldName] = getRandomArrElement(set);
          }
          break;

        case DataType.STRING:
          let lenMin, lenMax;
          if (!_.isUndefined(length)) {
            lenMin = 1;
            lenMax = 255;
          } else {
            lenMin = length[0];
            lenMax = length[1];
          }
          const strLength = getRandomValue([lenMin, 200]);
          obj[fieldName] = getRandomStr(strLength, locale);
          break;

        case DataType.ARRAY:
          obj[fieldName] = getRandomArr(imgs_arr, getRandomValue(length)).map(item => `imgstest/${item}`);
          break;

        case DataType.DATE:
          obj[fieldName] = !_.isUndefined(value) ? value : new Date();
          break;

        case DataType.ENUM:
          obj[fieldName] = set[getRandomValue([0, set.length])];
          break;

        case DataType.MONEY:
          obj[fieldName] = getRandomMoney(range);
          break;

        case DataType.PRODUCT_ATTRIBUTES:
          obj[fieldName] = getRandomAttributes(obj);
          break;

        default:
          break;
      }
    }
    result.push(obj);
  }
  return result;
}

app.get('/goods/:count', async (req, res, next) => {
  console.log('count: ' + req.params.count + ' Request received');
  const { count = 100 } = req.params;
  const { locale = 'en' } = req.query;

  const attributesGroup = await Attributes.findAll({
    raw: true,
  });

  const adjustAttributesValueToGroup = _.groupBy(attributesGroup, 'categoryId');

  const AttributesGroupMap = _.forEach(adjustAttributesValueToGroup,
    (item, key) => adjustAttributesValueToGroup[key] = item.map(i => i.attributeId));

  const categoryAttributes = await get_all_categories({
    attributes: ['id'],
    where: {
      leaf: true,
    },
  });

  LeafList = _.map(categoryAttributes.categories, item => item.id);

  AttributesByCategoryMap = Object.assign(
    {},
    ...categoryAttributes.categories.map(item => {
      return {
        [item.id]: AttributesGroupMap[item.id] || [],
      }
    }));

  const attributesValues = await AttributesValue.findAll({
    raw: true,
  });
  AttributeValueList = _.mapValues(_.groupBy(attributesValues, 'attributeId'), item => _.map(item, attr1 => attr1.id))

  const result = generate(products(), count, locale);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
});

// Server setup
app.listen(PORT, () => {
  console.log(`Running static-server on PORT ${PORT}...`);
});
