const Client = require('ssh2-sftp-client');
const config = require('./config');
const { storage: { remoteDirPath } } = require('../../config/config');

let sftp = new Client;

class fsService {
  constructor() {
    this.version = '0.0.1';
    this.remoteDirPath = remoteDirPath;
  }

  async putFile(sourceFile, distFile) {
    console.log('external putFile sourceFile, distFile', sourceFile, `${this.remoteDirPath}${distFile}`);
    sftp.connect(config)
      .then(async () => {

        await sftp.put(sourceFile, `${this.remoteDirPath}${distFile}`);
      })
      .catch(error => {
        console.error(error.message);
      })
      .finally(() => {
        sftp.end();
      });
  }

  async putFiles(fileList) {
    const sftp2 = new Client();
    return new Promise(function (resolve, reject) {
      sftp2.connect(config)
        .then(() => {
          return Promise.all(fileList.map(args => {
            return sftp2.put.apply(sftp2, args)
          }))
        })
        .then(() => sftp2.end())
        .then(resolve)
        .catch(reject)
    });
  }


  async deleteFile(remoteFile) {
    console.log('external deleteFile');
    sftp.connect(config)
      .then(async () => {
        await sftp.delete(`${this.remoteDirPath}${remoteFile}`);
      })
      .finally(() => {
        sftp.end();
      });
  }

  async exists(remoteObject) {
    console.log('external exists');
    sftp.connect(config)
      .then(async () => {
        await sftp.exists(`${this.remoteDirPath}${remoteObject}`);
      })
      .finally(() => {
        sftp.end();
      });
  }

  async mkdir(remoteDir, recursive = true) {
    console.log('external mkdir');
    sftp.connect(config)
      .then(async () => {
        await sftp.mkdir(`${this.remoteDirPath}${remoteDir}`, recursive);
      })
      .finally(() => {
        sftp.end();
      });
  }

  async rmdir(remoteDir, recursive = true) {
    console.log('external rmdir');
    sftp.connect(config)
      .then(async () => {
        await sftp.rmdir(`${this.remoteDirPath}${remoteDir}`, recursive);
      })
      .finally(() => {
        sftp.end();
      });
  }

  async rename(from, to = true) {
    console.log('external rename');
    sftp.connect(config)
      .then(async () => {
        await sftp.rename(`${this.remoteDirPath}${from}`, `${this.remoteDirPath}${to}`);
      })
      .finally(() => {
        sftp.end();
      });
  }
};

module.exports = new fsService();
