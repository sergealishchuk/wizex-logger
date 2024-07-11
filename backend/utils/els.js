/**
  const { els } = require('../../utils');

  const request = await els({
    method: 'GET',
    url: '/products/_search/template',
    data: {
      id: 'my-suggestion-template',
      params: {
        query_string: 'this',
      },
    },
  });
*/
const axios = require('axios');
const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env' });
const {
  ES_NODE,
  ES_USERNAME,
  ES_PASSWORD,
  ES_CRT_PATH,
} = process.env;

const token = `${ES_USERNAME}:${ES_PASSWORD}`;
const encodedToken = Buffer.from(token).toString('base64');
const headers = {
  'Authorization': 'Basic ' + encodedToken,
  'Content-Type': 'application/json; charset=utf-8',
};

const httpsAgent = new https.Agent({
  ca: fs.readFileSync(ES_CRT_PATH),
  rejectUnauthorized: false
});

const instance = axios.create({
  baseURL: ES_NODE,
  headers,
  httpsAgent,
});

module.exports = (options) => instance(options);
