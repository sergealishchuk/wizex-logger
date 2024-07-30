const _ = require("lodash");
const {
  Users,
  UserPayments,
  PaymentAccounts,
  sequelize
} = require('../../models');
const { Op } = require("sequelize");
const {
  createErrorMessage,
  getSystemVariables,
  dates: { dateIsBefore, dateIsSameOrBefore }
} = require('../../utils');

module.exports = async (req, res, tokenPayload) => {

  const UserID = tokenPayload.id;

  const { body = {} } = req;

  const user = await Users.findOne({
    where: { id: UserID },
    //attributes: ['id', 'shopnameFull', 'shopLogo', 'roles', 'seller_confirmed', 'seller_activated'],
    raw: true,
  });

  if (!user) {
    return {
      error: createErrorMessage("User not found"),
      ERROR_CODE: 'USER_NOT_FOUND'
    };
  }

  const PaymentsListRequest = await UserPayments.findAll({
    where: {
      userId: UserID
    },
    //attributes: ['date', 'payment', 'debit', 'operationType', 'params'],
    order: [
      ['date', 'DESC']
    ],
    raw: true,
  });

  const PaymentsList = PaymentsListRequest.map(item => {
    let params = {};

    try {
      params = JSON.parse(item.params);
    } catch (e) { };

    return ({
      ...item,
      params,
    })
  })

  const PaymentAccountsResult = await PaymentAccounts.findOne({
    where: {
      userId: UserID
    },
    attributes: ['tariff', 'next_tariff', 'tariff_valid_until', 'balance'],
    raw: true,
  });

  let tariffList = {};

  const { tariffs_standart } = await getSystemVariables('tariffs_standart');

  tariffList = Object.keys(tariffs_standart).map(item => ({
    tariff: item,
    price: tariffs_standart[item],
  }));

  const { tariff_valid_until } = PaymentAccountsResult;
  let tariffIsActual = false;
  if (tariff_valid_until) {
    tariffIsActual = dateIsSameOrBefore(new Date(), tariff_valid_until);
  }

  return {
    ok: true,
    data: {
      userId: UserID,
      tariffList,
      tariffs_standart,
      payments: PaymentsList,
      tariffIsActual,
      accounts: {
        paymentAccount: PaymentAccountsResult,
      }
    },
  }
};
