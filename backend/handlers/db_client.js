const { Client } = require('pg');
const  { db_config }  = require('../config.json');

module.exports = () => new Client(db_config);
