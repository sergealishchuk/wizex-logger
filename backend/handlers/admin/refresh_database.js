//const refresh = require('../../tools/refreshDb');
var pg = require('pg');
var fs = require('fs');
//const { Client } = require('@elastic/elasticsearch');
const path = require('path');
require('dotenv').config({ path: '../../../.env' });
const { APP_ENV } = process.env;
global.APP_ENV = APP_ENV || 'development';
console.log('Environment: ', global.APP_ENV);

const { ROLES } = require("../../constants");
const { Users, sequelize } = require('../../models');
const {
  createErrorMessage,
} = require('../../utils');


const config = require('../../config/config');

const populateData = async () => {
  const filePath = path.resolve(__dirname, '../../data-populate.sql');
  var sql = fs.readFileSync(filePath).toString();

  const { sequelize: { username, password, database, host } } = config;

  const pool = new pg.Pool({
    ...config.sequelize,
    user: config.sequelize.username,
  });

  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Can not connect to the DB" + err);
    }
    client.query(sql, function (err, result) {
      done();
      if (err) {
        console.log('error: ', err);
      }
    });
  });
};

const refresh = async () => {
  await sequelize.sync({ force: true });
  console.log('DB alioksDB has been refreshed!');
  console.log('Data populate in progress. Please wait...');
  await populateData();
  console.log('finish');
};

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

  try {
    await refresh();
    console.log('OK refresh');
  
    res.status(200).json({
      SUCCESS_CODE: "SUCCESS_REFRESH_DATABASE",
    })
    return;
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error refresh database"),
        ERROR_CODE: "ERROR_REFRESH_DATABASE"
      }
    );
    return;
  }
};
