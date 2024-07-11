const _ = require('lodash');
const sendMessages = require('./sendMessages');

module.exports = async ({
  partnersIds,
  partnersGroup,
  connections,
  config,
}) => {

  const partnersList = [...partnersIds];

  _.each(partnersIds, partner => {
    if (connections[partner]) {
      const connectionItems = Object.keys(connections[partner]);
      const connectionStatuses =
        _.map(connectionItems, item =>
          connections[partner][item].data.visible
        );

      if (_.findIndex(connectionStatuses, item => item) > -1) {
        _.remove(partnersList, item => item === partner);
      }
    }
  });

  if (partnersList.length > 0) {
    const messagesList = [];

    _.each(partnersList, partner => {
      const eventsList = partnersGroup[partner];
      const eventsByOrder = _.groupBy(eventsList, 'orderUid');

      _.each(eventsByOrder, (orderEvents, orderUid) => {
        const actualEvents = _.filter(orderEvents, event => [1, 2, 4, 8, 30].includes(event.stage));

        if (actualEvents.length > 0) {
          const stageProcessing = _.map(_.orderBy(
            _.filter(actualEvents, event => [1, 2, 4].includes(event.stage)), ['stage'], ['desc']
          ), item => item.stage);

          const stage = stageProcessing.length > 0 ? stageProcessing[0] : 30;

          messagesList.push({
            partner: Number(partner),
            stage,
            orderUid: Number(orderUid),
          });
        }
      })
    });

    if (messagesList.length > 0) {
      sendMessages(messagesList, config);
    }
  }
};
