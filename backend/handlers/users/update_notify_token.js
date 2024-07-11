const _ = require("lodash");
const { Op } = require("sequelize");
const { Users, Orders, Sids, NotificationTokens, sequelize } = require('../../models');
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../utils');

module.exports = async (req, res, tokenPayload) => {
  const { id: UserID, session } = tokenPayload;

  const user = await Users.findOne({ where: { id: UserID } });
  if (!user) {
    res.status(400).json(
      { error: createErrorMessage("User does not exist!") }
    );
    return;
  }

  const { token } = req.body;

  try {
    const result = await sequelize.transaction(async (t) => {

      const sidsRecord = await Sids.findOne({
        where: {
          userId: UserID,
        },
        raw: true,
      });

      const { sids } = sidsRecord;

      const indexCurrentSid = _.findIndex(sids, sid => sid === session);

      let newTokenList;
      if (indexCurrentSid > -1) {
        const tokensRecord = await NotificationTokens.findOne({
          where: {
            userId: UserID,
          },
          raw: true,
        });

        if (!tokensRecord) {
          const tokens = [];
          tokens[indexCurrentSid] = token;
          newTokenList = tokens;
          await NotificationTokens.create({
            userId: UserID,
            tokens,
          }, { transaction: t });
        } else {
          const { tokens } = tokensRecord;
          tokens[indexCurrentSid] = token;
          newTokenList = tokens;

          await NotificationTokens.update(
            {
              tokens,
            },
            {
              transaction: t,
              where: {
                userId: UserID,
              }
            });
        }
      }

      return {
        data: {
          session,
          sids,
          indexCurrentSid,
          newTokenList,
        }
      }
    });

    return {
      ok: true,
      ...result,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      { error: createErrorMessage("Update notify token error"), e }
    );
  }
};
