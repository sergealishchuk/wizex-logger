const _ = require('lodash');
const axios = require('axios');
const { Users } = require('../../models');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');
//const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

module.exports = async (parameters, res) => {
  const { body = {} } = parameters;
  const {
    email: inputEmail,
  } = body;

  const email = inputEmail.toLowerCase().trim();

  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return {
      error: createErrorMessage('User does not exist!'),
      status: 400,
    }
  }
  console.log(user);

  const { firstname } = user;
  const uuid = Math.floor(100000 + Math.random() * 900000);
  await Users.update({
    passwordrecoverid: uuid,
    passwordrecovertime: new Date().getTime(),
  }, {where: {email}});
  const local = 'http://localhost:3000';
  const response = await axios.get(`http://alioks.com/sendemail.php?name=${firstname}&email=${email}&uuid=${uuid}`);
  console.log('response', response);
  return {
    test: 'ok'
  }
}
