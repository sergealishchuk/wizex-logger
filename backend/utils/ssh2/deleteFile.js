const Client = require('ssh2-sftp-client');
const config = require('./config');

let sftp = new Client;

module.exports = (remoteFile) => {
  return sftp.connect(config)
    .then(() => {
      return sftp.delete(remoteFile)
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
