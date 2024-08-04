
const _ = require('lodash');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../../../../.env' });
const { APP_ENV } = process.env;
global.APP_ENV = APP_ENV || 'development';
console.log('APP_ENV:', APP_ENV);
const { Users } = require('../../models');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'serhii.alishchuk@alioks.com',
    pass: 'fggwoelgbiwpywcl'
  }
});

module.exports = async (parameters = {}) => {
  const {
    toUserId,
    subject = 'no subject',
    body = '',
  } = parameters;

  const userRequest = await Users.findOne({
    where: {
      id: toUserId,
    },
    raw: true,
  });

  if (!userRequest) {
    console.log(`error: User with id ${toUserId} not found`);
    return;
  }

  const { email } = userRequest;

  const mailOptions = {
    from: '"Wizex Mailer <no-replay@alioks.com>" <no-reply@alioks.com>',
    to: email,
    subject,
    text: 'body is empty',
    html: body,
  };

  const result = await transporter.sendMail(mailOptions);
  
  return {
    ok: true,
  };
};
