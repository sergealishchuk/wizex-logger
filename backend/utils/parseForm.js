
var _ = require('lodash');
var formidable = require('formidable');

var form = formidable({ multiples: true });

module.exports = async (req) => await new Promise((resolve, reject) =>
  form.parse(req, (error, fields, files) => {

    if (error) {
      console.log('err', error);
      reject(error);
    }

    resolve({fields, files});
  }));
