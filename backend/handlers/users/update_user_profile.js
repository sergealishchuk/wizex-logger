const _ = require('lodash');
const md5 = require('md5');
const { send_mail_by_template: sendTemplateMail } = require('../__controllers');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');
const { Users, ExchangeRates, ProfileChangesLog, sequelize } = require('../../models');
const config = require('../../config/config');
const { host, port } = config['frontend'];

const allows = [
  'firstname',
  'lastname',
  'email',
  'contactemail',
  'phone',
  'address',
  'password',
  'newpassword',
  'currencyCodeBuyer',
  'currencyCodeSeller',
  'locale',
  'allownotifications',
  'emailconfirmed',
  'ws',
  'roles'
];

module.exports = async (req, res, tokenPayload) => {
  let { body = {} } = req;
  const { id: UserID } = tokenPayload;

  const { email, password, newpassword } = body;

  body = _.omit(body, ['password', 'newpassword']);

  let result;
  let user;
  let uuid;

  try {
    result = await sequelize.transaction(async (transaction) => {
      const bodyKeys = _.keys(body);

      const checkArr = _.filter(bodyKeys, item => _.indexOf(allows, item) > -1);

      if (checkArr.length !== bodyKeys.length) {
        return {
          error: createErrorMessage("Bad parameters"),
          ERROR_CODE: 'BAD_PARAMETERS'
        };
      }

      user = await Users.findOne({
        where: {
          id: UserID,
        },
        raw: true,
      });

      if (!user) {
        return {
          error: createErrorMessage("User not found"),
          ERROR_CODE: 'USER_NOT_FOUND'
        };
      }

      let log = {
        userId: UserID,
        authorId: UserID,
        comment: '',
      };
      const dataHasPassword = bodyKeys.includes('password') || bodyKeys.includes('newpassword');
      if (dataHasPassword) {
        log.comment = '[user_change_password]';
      } else {
        log.comment = '[user_change_profile]';
        log.was = JSON.stringify(_.pick(user, bodyKeys));
        log.is = JSON.stringify(_.pick(body, bodyKeys));
      }

      const currencies = await ExchangeRates.findAll({
        attributes: ['currencyCode', 'digitalCode', 'symbol'],
        raw: true,
      });

      // temporary
      const locales = [
        {
          locale: 'en',
        },
        {
          locale: 'uk',
        }
      ];

      if ((email || newpassword) && (md5(password) !== user.password)) {
        return {
          error: createErrorMessage("Password does not valid"),
          ERROR_CODE: 'CURRENT_PASSWORD_NOT_VALID'
        };
      }

      // Changed password
      if (newpassword) {
        body.password = md5(newpassword);
      }

      // Email changed
      if (email) {
        if (email !== user.email) {
          const emailExist = await Users.findOne({
            where: {
              email
            },
            raw: true,
          });
          if (emailExist) {
            return {
              error: createErrorMessage(`Email ${email} is exists`),
              ERROR_CODE: {
                name: 'EMAIL_EXISTS',
                params: {
                  email,
                }
              }
            };
          }
        } else {
          return {
            error: createErrorMessage(`The email address ${email} has not changed, it is the same.`),
            ERROR_CODE: {
              name: 'EMAIL_THE_SAME',
              params: {
                email,
              }
            }
          };
        }
        uuid = Math.floor(100000 + Math.random() * 900000);
        body.emailconfirmed = false;
        body.emailconfirmid = uuid;
      }

      const userUpdate = await Users.update(
        body,
        {
          where: {
            id: UserID,
          },
          transaction,
        }
      );

      if (_.isArray(userUpdate) && userUpdate.length === 1) {

        const data = _.omit(_.pick(
          {
            ...user,
            ...body,
          },
          allows
        ), ['password', 'newpassword']);

        await ProfileChangesLog.create(
          log,
          {
            transaction,
          });

        return {
          data: {
            ...data,
            currencies,
            locales,
          },
        }
      }
    });

    if (result && !result.error) {
      if (email && email !== user.email) {
        const { firstname, lastname, locale } = result.data;
        await sendTemplateMail({
          toUserId: UserID,
          template: `EmailChanged_${locale}`,
          to: user.email,
          params: {
            username: `${firstname} ${lastname}`,
            email,
            url: `${host}:${port}`,
          }
        });
        await sendTemplateMail({
          toUserId: UserID,
          template: `ConfirmEmail_${locale}`,
          params: {
            username: `${firstname} ${lastname}`,
            code: uuid,
            url: `${host}:${port}`,
          }
        });
      }
    }
    return {
      ok: true,
      ...result,
    };
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Update user profile error"),
        ERROR_CODE: "ERROR_UPDATE_USER_PROFILE",
        serror: handleSequelizeErrors(e),
      }
    );
  }
};
