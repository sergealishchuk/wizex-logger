const _ = require('lodash');
const { handleSequelizeErrors } = require('../../utils');
const { Users, Sids, sequelize } = require('../../models');

module.exports = async (req, res, tokenPayload) => {
  const { id: UserID, session } = tokenPayload;
  const user = await Users.findOne({ where: { id: UserID } });

  if (!user) {
    res.status(400).json({ error: { errors: [{ message: 'User does not exist!' }] } });
    return;
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const { body: { logoutAllConnection = true } } = req;

      const sidsRequest = await Sids.findOne({
        transaction,
        where: {
          userId: UserID,
        },
        attributes: ['sids'],
        raw: true,
      });

      const { sids } = sidsRequest;

      const nextSids = logoutAllConnection ? [] : sids.filter(item => item !== session );

      await Sids.update(
        {
          sids: nextSids,
        },
        {
          transaction,
          where: {
            userId: UserID,
          }
        });

      return true;

    });
    if (result) {
      return {
        ok: true,
      }
    }
  } catch (error) {
    res.status(400).json(handleSequelizeErrors(error));
  }

  return ({
    ok: true,
  });
};
