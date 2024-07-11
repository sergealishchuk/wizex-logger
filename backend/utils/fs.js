//const { storage: { storageLocal } } = require('../config');

const storageLocal = false; // TODO: need clarify

// const fileService = storageLocal
//   ? require('./ssh2/fs.local.service')
//   : require('./ssh2/fs.service');
const fileService = require('./ssh2/fs.service');

module.exports = fileService;
