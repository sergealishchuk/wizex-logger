const { readFileSync } = require('fs');
const path = require('path');

module.exports = {
    "host": "167.172.183.161",
    "port": 22,
    "username": "storage",
    "privateKey": readFileSync(path.resolve(__dirname, 'id_rsa')),
};
