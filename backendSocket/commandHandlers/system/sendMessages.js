const { translateStrWithParams } = require('../../utils');
const _ = require('lodash');
const axios = require('axios');
const { Op } = require("sequelize");
const {
  Users,
  Orders,
  NotificationTokens,
  SentMessages,
  sequelize,
} = require('../../../backend/models');

require('dotenv').config({ path: '../../../.env' });
const { FIREBASE_SERVER_KEY } = process.env;

const stageMapper = {
  1: 'new_order',
  2: 'order_confirmed',
  4: 'order_shipped',
  8: 'new_message',
  9: 'new_message',
  30: 'new_message',
};

module.exports = async (messages, config) => {
  const ordersListUids = _.map(
    _.uniq(
      Object.keys(
        _.groupBy(messages, 'orderUid')
      )
    ),
    item => Number(item)
  );

  const partnersList = _.map(
    _.uniq(
      Object.keys(
        _.groupBy(messages, 'partner')
      )
    ),
    item => Number(item)
  );

  try {
    const result = await sequelize.transaction(async (t) => {
      const { frontend: { host } } = config;
      const ordersList = await Orders.findAll({
        where: {
          orderUid: { [Op.in]: ordersListUids },
        },
        attributes: [
          'topId',
          'orderUid',
          'sellerTopId',
          'sellerMessageTopId',
          'buyerTopId',
          'buyerMessageTopId',
          'sellerId',
          'userId'
        ],
        raw: true,
      });

      const ordersGroup = _.groupBy(ordersList, 'orderUid');

      const usersList = await Users.findAll({
        where: {
          id: { [Op.in]: partnersList },
        },
        attributes: ['id', 'locale', 'allownotifications'],
        raw: true,
      });

      const usersGroup = _.groupBy(usersList, 'id');

      const notificationTokensList = await NotificationTokens.findAll({
        where: {
          userId: { [Op.in]: partnersList },
        },
        attributes: ['userId', 'tokens'],
        raw: true,
      });

      const notificationTokensGroup = _.groupBy(notificationTokensList, 'userId');

      const dataForSave = [];
      for (var index = 0; index < messages.length; ++index) {
        const message = messages[index];
        const { partner, stage, orderUid } = message;

        if (!usersGroup[partner][0].allownotifications) {
          continue;
        }

        const {
          topId,
          sellerTopId,
          sellerMessageTopId,
          buyerTopId,
          buyerMessageTopId,
          sellerId,
          userId,
        } = ordersGroup[String(orderUid)][0];

        const partnerIsSeller = (partner === sellerId);

        if (
          (partnerIsSeller && stage === 0) ||
          (partnerIsSeller && sellerTopId >= sellerMessageTopId) ||
          (!partnerIsSeller && buyerTopId >= buyerMessageTopId)
        ) {

          const tokens = _.filter(notificationTokensGroup[partner][0].tokens, item => item !== null);
          try {
            let successCount = 0;
            let failureCount = 0;
            const sentAt = new Date().getTime();
            for (let index = 0; index < tokens.length; ++index) {
              const token = tokens[index];
              
              const notifications = {
                notification:
                {
                  title: "alioks.com",
                  tag: String(orderUid),
                  body: {text: translateStrWithParams(stageMapper[stage], { locale: usersGroup[partner][0].locale, params: { orderUid } }), sentAt, uid: partner},
                  icon: "https://storage.alioks.com/img/aoks2/small_logo.png",
                  data: {time: new Date().getTime()},
                  click_action: `${host}/${partnerIsSeller ? 'admin/customer_orders/' : 'my_orders/'}${orderUid}`
                }
                ,
                to: token,
              };

              const response = await axios
                .post(
                  "https://fcm.googleapis.com/fcm/send",
                  notifications,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization:
                        `key=${FIREBASE_SERVER_KEY}`
                    }
                  }
                )
              const { success, failure } = response.data;
              successCount = successCount + success;
              failureCount = failureCount + failure;
            }

            dataForSave.push({
              userId: partner,
              success: successCount,
              failure: failureCount,
              messageType: stage,
              seller: partnerIsSeller,
              orderUid,
              sentAt,
            });
          } catch (e) {
            //
            console.log('error', e);
          }

          await Orders.update({
            [partnerIsSeller ? 'sellerMessageTopId' : 'buyerMessageTopId']: topId,
          },
            {
              transaction: t,
              where: {
                orderUid,
              }
            }
          );
        }

      };

      await SentMessages.bulkCreate(dataForSave);

      return {
        data: {
        },
      };
    });

    return {
      ok: true,
      ...result,
    }
  } catch (e) {
    console.log(e);
  }
};
