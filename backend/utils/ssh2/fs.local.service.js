
const fs = require('fs-extra');
const { storage: { localDirPath } } = require('../../config');

class fsLocalService {
  constructor() {
    this.version = '0.0.1';
    this.localDirPath = localDirPath;
  }

  async putFile(sourceFile, distFile) {
    console.log('local putFile');
    try {
      await fs.copy(sourceFile, `${this.localDirPath}${distFile}`)
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async deleteFile(file) {
    console.log('local deleteFile');
    try {
      await fs.remove(sourceFile, `${this.localDirPath}${file}`)
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async exists(file) {
    console.log('local exists');
    try {
      await fs.pathExists(`${this.localDirPath}${file}`)
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async mkdir(dir, recursive = true) {
    console.log('local mkdir');
    try {
      await fs.ensureDir(`${this.localDirPath}${dir}`)
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async rmdir(dirOrFile) {
    console.log('local rmdir');
    try {
      await fs.remove(`${this.localDirPath}${dirOrFile}`)
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async rename(from, to = true) {
    console.log('local rename');
    try {
      await fs.rename(`${this.localDirPath}${from}`, `${this.localDirPath}${to}`)
    }
    catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = new fsLocalService;
