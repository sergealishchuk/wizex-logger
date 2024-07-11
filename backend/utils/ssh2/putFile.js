const Client = require('ssh2-sftp-client');
const config = require('./config');

let sftp = new Client;

module.exports = (buffer, remotePath) => {
  return sftp.connect(config)
    .then(() => {
      return sftp.put(buffer, remotePath)
    })
    .then(() => {
      return {
        result: 'Success',
      }
    })
    .finally(() => {
      sftp.end();
    });
};
