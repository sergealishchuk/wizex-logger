
const _ = require('lodash');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../../../../.env' });
const { APP_ENV } = process.env;
global.APP_ENV = APP_ENV || 'development';
console.log('APP_ENV:', APP_ENV);
const { Users, EmailTemplates, sequelize } = require('../../models');
const handlebars = require('handlebars');

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
    template = '',
    subject: customSubject,
    params = {},
    to,
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

  const templateRequest = await EmailTemplates.findOne({
    where: {
      name: template,
    },
    raw: true,
    attributes: ['body', 'subject']
  });
  if (!templateRequest) {
    console.log(`error: Template ${template} not found`);
    return;
  }

  const { body, subject } = templateRequest;

  const templateEmail = handlebars.compile(body);
  const htmlToSend = templateEmail(params);
  const mailOptions = {
    from: '"Alioks Mailer <no-replay@alioks.com>" <no-reply@alioks.com>',
    to: to || email,
    subject: `${customSubject || subject} | ${new Date().getTime()}`,
    text: 'body is empty',
    html: htmlToSend,
  };

  const result = await transporter.sendMail(mailOptions);

  return {
    ok: true,
    result,
  };
};
