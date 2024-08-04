const _ = require("lodash");
const { ROLES } = require("../../../constants");
const { Users } = require('../../../models');
const handlebars = require('handlebars');
const {
  createErrorMessage,
} = require('../../../utils');
const { send_mail: sendMail } = require('../../__controllers');


module.exports = async (req, res, tokenPayload) => {
  const UserID = tokenPayload.id;
  const user = await Users.findOne({
    where: { id: UserID },
    attributes: ['id', 'roles', 'email'],
    raw: true,
  });

  if (!user) {
    res.status(400).json(
      {
        error: createErrorMessage("User does not exist!"),
        ERROR_CODE: "USER_DOES_NOT_EXIST"
      }
    );
    return;
  }

  const { roles } = user;

  if (!roles.includes(ROLES.ADMIN)) {
    res.status(400).json(
      {
        error: createErrorMessage("No permisions"),
        ERROR_CODE: "NO_PERMISSIONS"
      }
    );
    return;
  }

  try {
    const { body: bodyRequest = {} } = req;
    const {
      subject = 'no subject',
      body,
      params,
      sendme = false,
    } = bodyRequest;

    const templateEmail = handlebars.compile(body);
    const htmlEmailBody = templateEmail(params);

    if (sendme) {
      await sendMail({
        toUserId: UserID,
        subject,
        body: htmlEmailBody,
      });
    }

    const resultObject = {
      result: {
        htmlEmailBody,
      },
    };

    if (sendme) {
      resultObject['SUCCESS_CODE'] = {
        name: "SUCCESS_SENT_EMAIL_TEMPLATE",
        params: {
          email: user.email,
        }
      }
    }

    return {
      ok: true,
      ...resultObject,
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error compile email templates"),
        ERROR_CODE: "ERROR_COMPILE_EMAIL_TEMPLATE"
      }
    );
  }
};
