const Client = require('ssh2-sftp-client');
const config = require('./config');

let sftp = new Client;

module.exports = (path) => {
  return sftp.connect(config)
    .then(() => {
      return sftp.list(path)
    })
    .then((content) => {
      return {
        path,
        content,
      }
    })
    .finally(() => {
      sftp.end();
    });
};
