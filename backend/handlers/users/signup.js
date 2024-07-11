const md5 = require("md5");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
var geoip = require('geoip-lite');
const { handleSequelizeErrors, fileService } = require('../../utils');
const { Users, Sids, NotificationTokens, sequelize } = require('../../models');

module.exports = async (parameters, res) => {
  const { body = {} } = parameters;
  const { firstname, lastname, email: inputEmail, contactemail, password, locale } = body;
  const email = inputEmail.toLowerCase().trim();
  const ip = parameters.headers['x-forwarded-for'] || parameters.socket.remoteAddress;
  const geo = geoip.lookup(ip);
  const country = geo ? geo.country : 'UA';

  const uuid = uuidv4();

  let result;
  try {
    result = await sequelize.transaction(async (t) => {
      const user = await Users.create({
        firstname,
        lastname,
        email,
        contactemail,
        password,
        emailconfirmid: uuid,
        emailconfirmed: false,
        country,
      }, { transaction: t });

      try {
        const response = await axios.get(`http://alioks.com/confirmemail.php?name=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&locale=${locale}`);
      } catch (e) {
        //
      }
      const { id: UserID } = user;

      await fileService.mkdir(`products/${UserID}`);

      await Sids.create({
        userId: UserID,
      }, { transaction: t });

      await NotificationTokens.create({
        userId: UserID,
      }, { transaction: t });

      return {
        data: {
          firstname,
          lastname,
          email,
        },
        signUpSuccess: true,
        status: 201,
      };
    });
    return result;
  } catch (error) {
    res.status(400).json(handleSequelizeErrors(error));
  };
};
