const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const md5 = require('md5');
const { createErrorMessage, handleSequelizeErrors } = require('../../utils');
const { Users, Sids, sequelize } = require('../../models');
const { tokens } = require('../../jwt-config');
require('dotenv').config({ path: '../.env' });
const { JWT_SECRET_KEY } = process.env;

module.exports = async (parameters, res) => {
  const { body = {} } = parameters;
  const { email: inputEmail, password } = body;
  const email = inputEmail.toLowerCase().trim();

  const user = await Users.findOne({ where: { email } });

  if (!user) {
    res.status(400).json({
      error: createErrorMessage(`User with email address ${email} does not exist`),
      ERROR_CODE: {
        name: 'USER_WITH_EMAIL_NOT_EXISTS',
        params: {
          email,
        }
      }
    });
    return;
  }

  const isValid = _.isEqual(user.password, md5(password));

  if (isValid) {
    const { id } = user;
    const sessionId = uuidv4();

    const token = jwt.sign(
      {
        id,
        session: sessionId,
      },
      JWT_SECRET_KEY,
      { expiresIn: tokens.access.expiresIn }
    );

    let result;
    try {
      result = await sequelize.transaction(async (t) => {

        const sidsRecord = await Sids.findOne({
          where: {
            userId: id,
          },
          raw: true,
        });

        const { sids } = sidsRecord;
        await Sids.update(
          {
            sids: [...sids, sessionId],
          },
          {
            transaction: t,
            where: {
              userId: id,
            }
          });

      });
    } catch (error) {
      res.status(400).json({
        error: handleSequelizeErrors(error),
        ERROR_CODE: 'LOGIN_ERROR',
      });
      return;
    }

    return ({
      ok: true,
      user: {
        ..._.pick(user, ['firstname', 'lastname', 'email', 'phone']),
        name: `${user.firstname} ${user.lastname}`,
        data: {
          token,
          refreshToken: '',
        }
      }
    })
  } else {
    res.status(400).json({
      error: { errors: [{ message: 'Invalid credentials!' }] },
      ERROR_CODE: 'INVALID_CREDENTIALS'
    });
  }
};
