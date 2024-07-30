
const { PaymentAccounts } = require('../../models');
const { dates: { dateIsSameOrBefore } } = require('../../utils');

module.exports = async (parameters = {}) => {
  const { userId } = parameters;

  const paymentAccountsRequest = await PaymentAccounts.findOne({
    where: { userId },
    raw: true,
  });

  let tariffValid = false;
  if (paymentAccountsRequest) {
    const { tariff_valid_until } = paymentAccountsRequest;
    if (tariff_valid_until) {
      tariffValid = dateIsSameOrBefore(new Date(), tariff_valid_until);
    }
  }

  return {
    tariffValid,
    userId,
  }
}