'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
let routers = [];

const dirGlobalRouters = path.join(__dirname, '..', '/routers');
const dirLocalRouters = path.join(__dirname, '..', '/local/routers');

fs
  .readdirSync(dirGlobalRouters)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json');
  })
  .forEach(file => {
    const r = require(`../routers/${file}`);
    if (Array.isArray(r)) {
      routers = [...routers, ...r];
    }
  });

  fs
  .readdirSync(dirLocalRouters)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-5) === '.json');
  })
  .forEach(file => {
    const r = require(`../local/routers/${file}`);
    if (Array.isArray(r)) {
      routers = [...routers, ...r];
    }
  });

module.exports = routers;
