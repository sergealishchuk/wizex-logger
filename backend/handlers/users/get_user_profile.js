const _ = require("lodash");
const { Users, ExchangeRates, PaymentAccounts, UserPayments } = require('../../models');
const { dates: { dateIsSameOrBefore } } = require('../../utils');

module.exports = async (req, res, tokenPayload) => {
  const { id } = tokenPayload;

  const user = await Users.findOne({ where: { id } });

  const currencies = await ExchangeRates.findAll({
    attributes: ['currencyCode', 'digitalCode', 'symbol'],
  });

  const paymentAccountsRequest = await PaymentAccounts.findOne({
    where: {
      userId: id,
    },
    raw: true,
  });

  let tariffValid = false;
  if (paymentAccountsRequest) {
    const { tariff_valid_until } = paymentAccountsRequest;
    if (tariff_valid_until) {
      tariffValid = dateIsSameOrBefore(new Date(), tariff_valid_until);
    }
  }

  const userPaiedAtLeastOneTime = Boolean(await UserPayments.findOne({
    where: {
      userId: id,
    },
    raw: true,
  }));

  // temporary
  const locales = [
    {
      locale: 'en',
    },
    {
      locale: 'uk',
    }
  ];

  if (user) {
    const {
      email = "",
      contactemail = "",
      firstname = "",
      lastname = "",
      phone = "",
      address = "",
      country = "",
      locale = "",
      emailconfirmed,
      roles = [],
      id,
      allownotifications = true,
      locked,
      trialwasused,
    } = user;
    return {
      ok: true,
      user: {
        email,
        contactemail,
        firstname,
        lastname,
        phone,
        address,
        country,
        emailconfirmed,
        locale,
        roles,
        uid: id,
        currencies,
        locales,
        allownotifications,
        locked,
        tariffValid,
        trialwasused,
        userPaiedAtLeastOneTime,
      },
    };
  } else {
    res.status(400).json({ error: { errors: [{ message: "User does not exist!" }] } });
  }
};
