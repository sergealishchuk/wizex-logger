require('dotenv').config({ path: '.env' });
const { APP_ENV } = process.env;
global.APP_ENV = APP_ENV || 'development';

const {
  storage,
  frontend,
  server,
  socketServer,
} = require('../config/config');

module.exports = {
  storage,
  frontend,
  server,
  socketServer,
};
