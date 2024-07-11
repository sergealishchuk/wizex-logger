const _ = require('lodash');
const md5 = require('md5');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');
const { Users, ExchangeRates, ProfileChangesLog } = require('../../models');

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
];

module.exports = async (parameters, res, tokenPayload) => {
  let { body = {} } = parameters;
  const { id } = tokenPayload;

  const bodyKeys = _.keys(body);

  const checkArr = _.filter(bodyKeys, item => _.indexOf(allows, item) > -1);

  if (checkArr.length !== bodyKeys.length) {
    res.status(400).json(createErrorMessage('Bad parameters!'));
    return;
  }

  const user = await Users.findOne({ where: { id } });
  if (!user) {
    res.status(400).json({ error: createErrorMessage('User does not exist!') });
    return;
  }

  let log = {
    userId: id,
    authorId: id,
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

  const email = _.get(body, 'email');
  const password = _.get(body, 'password');
  const newpassword = _.get(body, 'newpassword');

  body = _.omit(body, ['password', 'newpassword']);

  const { password: currentPassword } = user;

  if (email && (md5(password) !== currentPassword)) {
    res.status(400).json({ error: createErrorMessage('Password does not valid!') });
    return;
  }

  if (newpassword) {
    if (md5(password) !== currentPassword) {
      res.status(400).json({
        error: createErrorMessage('Current password does not valid!')
      });
      return;
    } else {
      return Users.update(
        { password: md5(newpassword) },
        {
          where: {
            id,
          }
        })
        .then(async (rows) => {
          if (_.isArray(rows) && rows.length === 1) {
            await ProfileChangesLog.create(log);
            return {
              ok: true,
            }
          } else {
            return {
              error: createErrorMessage('User does not exist!'),
              status: 400,
            };
          }
        })
        .catch((error) => {
          res.status(400).json(handleSequelizeErrors(error));
        });
    }
  }

  return Users.update(
    body,
    {
      where: {
        id,
      }
    })
    .then(async (rows) => {
      if (_.isArray(rows) && rows.length === 1) {

        const data = _.omit(_.pick(
          {
            ...user.dataValues,
            ...body,
          },
          allows
        ), ['password', 'newpassword']);

        await ProfileChangesLog.create(log);

        return {
          ok: true,
          data: {
            ...data,
            currencies,
            locales,
          },
        }
      } else {
        return {
          error: createErrorMessage('User does not exist!'),
          status: 400,
        };
      }
    })
    .catch((error) => {
      res.status(400).json(handleSequelizeErrors(error));
    });
};
