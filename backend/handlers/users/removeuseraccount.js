const _ = require('lodash');
const md5 = require('md5');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');
const { Users } = require('../../models');

module.exports = async (parameters, res, tokenPayload) => {
  let { body = {} } = parameters;
  const { id } = tokenPayload;



  const user = await Users.findOne({ where: { id } });
  if (!user) {
    res.status(400).json({ error: createErrorMessage('User does not exist!') });
    return;
  }

  const password = _.get(body, 'password');

  const { password: currentPassword, email } = user;

  const uuid = Math.floor(100000 + Math.random() * 900000);

  if (md5(password) !== currentPassword) {
    res.status(400).json({
      error: createErrorMessage('Current password does not valid!')
    });
    return;
  } else {
    return Users.update(
      { email: `del_${uuid}.${email}` },
      {
        where: {
          id,
        }
      })
      .then((rows) => {
        return {
          ok: true,
        }
      })
      .catch((error) => {
        res.status(400).json(handleSequelizeErrors(error));
      }
    );
  }
}
