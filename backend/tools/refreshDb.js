var pg = require('pg');
var fs = require('fs');
require('dotenv').config({ path: '../../.env' });
const { APP_ENV } = process.env;
global.APP_ENV = APP_ENV || 'development';
console.log('Environment: ', global.APP_ENV);

const config = require('../config/config');

const populateData = async () => {
  var sql = fs.readFileSync('../data-populate.sql').toString();

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
        process.exit(1);
      }
      process.exit(0);
    });
  });
};

const { sequelize } = require('../models');
const refresh = async () => {
  await sequelize.sync({ force: true });
  console.log('DB alioksDB has been refreshed!');
  console.log('Data populate in progress. Please wait...');
  await populateData();
  console.log('finish');
};

refresh();
