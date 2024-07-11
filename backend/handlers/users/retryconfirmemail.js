const md5 = require("md5");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { handleSequelizeErrors } = require('../utils');
const { User } = require('../models');

module.exports = async (parameters, res, tokenPayload) => {
  const { id } = tokenPayload;
  const user = await User.findOne({ where: { id } });
  const { emailconfirmid, emailconfirmed, firstname, email } = user;

  if (emailconfirmed) {
    return {
      status: 200,
      code: 'CONFIRM_DUBLICATE',
      validationMessage: 'Duplicate confirmation. Your email has been verified before!',
    }
  }

  const uuid = emailconfirmid || uuidv4();;

  return User.update({
    emailconfirmid: uuid,
    emailconfirmed: false,
  }, { where: { id } })
    .then(async () => {
      const local = 'http://localhost:3000';
      const response = await axios.get(`http://alioks.com/confirmemail.php?name=${firstname}&email=${email}&uuid=${uuid}&origin=${local}`);
      console.log('response', response);
      return {
        success: true,
        status: 201,
      };
    })
    .catch(error => {
      console.log('error', error);
      res.status(400).json(handleSequelizeErrors(error));
    });
};
