
const _ = require("lodash");
const moment = require("moment");
const { Op } = require("sequelize");
const { SentMessages, sequelize } = require('../../models');
const {
  handleSequelizeErrors,
  createErrorMessage,
} = require('../../utils');

const getDiffTime = (startTime, endTime) => {
  var dif = moment.duration(moment(endTime).diff(moment(startTime)));
  return `${[('0' + dif.hours()).slice(-2), ('0' + dif.minutes()).slice(-2), ('0' + dif.seconds()).slice(-2)].join(':')}.${('000' + dif.milliseconds()).slice(-3)}`;
}

module.exports = async (req, res) => {
  const body = req.body;

  try {
    const result = await sequelize.transaction(async (t) => {
      const { notification: { body } } = req.body;
      const bodyObject = JSON.parse(body);
      const { uid, sentAt } = bodyObject;

      const existingMessage = await SentMessages.findOne({
        attributes: ['userId', 'sentAt', 'delivered'],
        where: {
          userId: uid,
          sentAt,
        },
        raw: true,
      });

      if (existingMessage) {
        const { delivered } = existingMessage;
        if (delivered) {
          return {
            ok: true,
          }
        }

        const endTime = new Date().getTime();

        await SentMessages.update({
          delivered: true,
          deliveryAt: new Date(),
          deliveryTime: getDiffTime(sentAt, endTime),
        }, {
          where: {
            userId: uid,
            sentAt,
          },
          transaction: t,
        });
      }
    });

    return {
      ok: true,
    }
  } catch (e) {
    res.status(400).json(
      { error: createErrorMessage("Error add read record") }
    );
  }
};
