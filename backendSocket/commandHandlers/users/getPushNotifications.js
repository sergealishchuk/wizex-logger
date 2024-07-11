const _ = require('lodash');
const { Users, SentMessages } = require('../../../backend/models');

module.exports = async (params, tokenPayload) => {
  const { id: UserID } = tokenPayload;

  try {
    const messagesList = await SentMessages.findAll({
      include: [{
        model: Users,
        attributes: ['firstname', 'lastname']
      }],
      limit: 30,
      order: [
        ['id', 'DESC']
      ],
      raw: true,
    });

    return {
      ok: true,
      data: {
        messagesList,
      },
    };
  } catch (e) {
    console.log(e);
  }
};
