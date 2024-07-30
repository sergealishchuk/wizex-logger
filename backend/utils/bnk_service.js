const axios = require('axios');
const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env' });
const {
  MONO_TOKEN,
  MONO_API_URL,
  ES_CRT_PATH,
} = process.env;

const headers = {
  'X-Token': MONO_TOKEN,
  'Content-Type': 'application/json; charset=utf-8',
};

const httpsAgent = new https.Agent({
  // ca: fs.readFileSync(ES_CRT_PATH),
  // rejectUnauthorized: false
});

const instance = axios.create({
  baseURL: MONO_API_URL,
  headers,
  httpsAgent,
});

module.exports = (options) => instance(options);
