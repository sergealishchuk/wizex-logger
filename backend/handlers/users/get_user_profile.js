const _ = require("lodash");
const { Users, ExchangeRates } = require('../../models');

module.exports = async (req, res, tokenPayload) => {
  const { id } = tokenPayload;

  const user = await Users.findOne({ where: { id } });

  const currencies = await ExchangeRates.findAll({
    attributes: ['currencyCode', 'digitalCode', 'symbol'],
  });

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
      currencyCodeBuyer = "",
      currencyCodeSeller = "",
      locale = "",
      roles = [],
      id,
      allownotifications = true,
      locked,
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
        currencyCodeBuyer,
        currencyCodeSeller,
        locale,
        roles,
        uid: id,
        currencies,
        locales,
        allownotifications,
        locked,
      },
    };
  } else {
    res.status(400).json({ error: { errors: [{ message: "User does not exist!" }] } });
  }
};
