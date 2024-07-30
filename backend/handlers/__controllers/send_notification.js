const _ = require("lodash");
const { Users, Notifications, PostLogNotif, sequelize } = require('../../models');
const { Op } = require("sequelize");
const {
  createErrorMessage,
  socketConnector,
} = require('../../utils');

module.exports = async (parameters = {}) => {
  const { userID, subject = '', message = '', transaction } = parameters;

  try {
    const userTo = await Users.findOne({
      transaction,
      where: {
        id: userID,
      },
      include: [
        {
          model: PostLogNotif,
          as: 'postlog',
          attributes: ['id'],
        }
      ],
      raw: true,
    });

    if (!userTo) {
      return (
        {
          error: createErrorMessage("Recepient not found"),
          ERROR_CODE: "RECEPIENT_NOT_FOUND"
        }
      );
    }

    const { 'postlog.id': postLogNotifId, id: userId } = userTo;

    const send = await Notifications.create({
      to: userID,
      subject,
      message,
      userId,
    }, {
      transaction,
    });

    /*const { id: topId } = send;

    if (!postLogNotifId) {
      await PostLogNotif.create({
        topId,
        userId,
      }, {
        transaction,
      });
    } else {
      await PostLogNotif.update({
        topId,
      }, {
        transaction,
        where: {
          userId,
        }
      })
    }
    */

    const unReadedCountRequest = await Notifications.findOne({
      transaction,
      where: {
        to: userId,
        read: false,
      },
      attributes: [
        [sequelize.fn('COUNT', 'id'), 'UnreadCount'],
      ],
      raw: true,
    });
    const unreadCount = Number(unReadedCountRequest.UnreadCount);

    socketConnector.socketEmit({
      command: 'http.clientStatusesHasBeenChagned',
      params: {
        userID,
        type: 'notification',
        count: unreadCount,
      }
    });

    return {
      topId,
      ok: true,
      SUCCESS_CODE: 'SUCCESS_SENT_NOTIFICATION',
    };

  } catch (e) {
    console.log(e);
    return (
      { error: createErrorMessage("Error send notification") }
    );
  }
};
