const md5 = require("md5");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
var geoip = require('geoip-lite');
const { createErrorMessage, handleSequelizeErrors, fileService } = require('../../utils');
const { Users, Sids, NotificationTokens, PaymentAccounts, sequelize } = require('../../models');
const { send_mail_by_template: sendTemplateMail } = require('../__controllers');
const config = require('../../config/config');

const { host, port } = config['frontend'];

module.exports = async (parameters, res) => {
  const { body = {} } = parameters;
  const { firstname, lastname, email: inputEmail, contactemail, password, locale = 'en' } = body;
  const email = inputEmail.toLowerCase().trim();
  const ip = parameters.headers['x-forwarded-for'] || parameters.socket.remoteAddress;
  const geo = geoip.lookup(ip);
  const country = geo ? geo.country : 'UA';

  const uuid = Math.floor(100000 + Math.random() * 900000);

  let result;
  try {
    result = await sequelize.transaction(async (transaction) => {
      const existUser = await Users.findOne({
        where: { email },
        attributes: ['id'],
        raw: true,
      });

      if (existUser) {
        return {
          error: createErrorMessage(`A user with the email address ${email} already exists`),
          ERROR_CODE: {
            name: 'USER_WITH_EMAIL_ALREADY_EXISTS',
            params: {
              email,
            }
          }
        };
      }

      const user = await Users.create({
        firstname,
        lastname,
        email,
        contactemail,
        password,
        emailconfirmid: uuid,
        emailconfirmed: false,
        country,
        locale,
      }, { transaction });

      const { id: UserID } = user;

      await fileService.mkdir(`products/${UserID}`);

      await Sids.create({
        userId: UserID,
      }, { transaction });

      await NotificationTokens.create({
        userId: UserID,
      }, { transaction });

      await PaymentAccounts.create({
        userId: UserID,
        balance: 0,
        tariff: 10000,
      }, {
        transaction,
      });

      return {
        data: {
          firstname,
          lastname,
          email,
          locale,
        },
        signUpSuccess: true,
        userId: UserID,
        status: 201,
      };
    });

    if (result && result.signUpSuccess) {
      const { userId, data: { firstname, lastname } } = result;
      await sendTemplateMail({
        toUserId: userId,
        template: `Welcome_${locale}`,
        params: {
          username: `${firstname} ${lastname}`,
          code: uuid,
          url: `${host}:${port}`
        }
      })
    }
    return result;
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: handleSequelizeErrors(error),
      ERROR_CODE: 'REGISTRATION_ERROR'
    });
  };
};
