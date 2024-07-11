// !!! Need to debug and test!

const Client = require('ssh2-sftp-client');
const config = require('./config');

let sftp = new Client;

//https://stackoverflow.com/questions/50521222/how-do-i-send-put-multiple-files-using-nodejs-ssh2-sftp-client
//https://github.com/theophilusx/ssh2-sftp-client/issues/73
module.exports = (fileList) => {
  return new Promise(function(resolve, reject) {
    return sftp.connect(config)
    .then(() => {
      return Promise.all(fileList.map(args => {
        // ?? args = [[buffer, remotePath],[...]]
        return sftp.put.apply(sftp, args)
      }))
    })
    .then(() => sftp.end())
    .then(resolve)
    .catch(reject)
  });
}