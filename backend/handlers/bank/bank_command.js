const _ = require("lodash");
const { ROLES } = require("../../constants");
const { Users, Invoices, sequelize } = require('../../models');
const { v4 } = require('uuid');

require('dotenv').config({ path: '.env' });

const {
  handleSequelizeErrors,
  createErrorMessage,
  //  bankApi,
  bnkService: bs,
} = require('../../utils');

const {
  MONO_DESTINATION,
  MONO_REDIRECT_URL,
  MONO_WEBHOOK_URL,
} = process.env;

module.exports = async (req, res, tokenPayload) => {
  const UserID = tokenPayload.id;
  const user = await Users.findOne({
    where: { id: UserID },
    attributes: ['id', 'roles', 'email', 'locale'],
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

  const { roles, email } = user;

  // if (!roles.includes(ROLES.SELLER)) {
  //   res.status(400).json(
  //     {
  //       error: createErrorMessage("No permisions"),
  //       ERROR_CODE: "NO_PERMISSIONS"
  //     }
  //   );
  //   return;
  // }

  const { body = {} } = req;

  try {
    const result = await sequelize.transaction(async (t) => {
      const { command, params = {} } = body;

      console.log('bankApi', bankApi);
      const runer = bankApi[command];
      let res = {};
      if (runer) {
        switch (command) {
          case 'createInvoice':
            const invoiceNum = await Invoices.findAll({
              attributes: ['id'],
              order: [['id', 'DESC']],
              limit: 1,
              raw: true,
            });
            console.log('invoiceNum', invoiceNum);
            const invoiceNumber = `${invoiceNum.length > 0 ? invoiceNum[0].id + 1 : 1}-${v4().slice(0, 4)}`;
            
            res = await runer({
              ...params,
              merchantPaymInfo: {
                reference: JSON.stringify({ sellerId: UserID, invoiceNumber }),
                //destination: 'За розміщення товарів та послуг на сайті alioks.com',
                destination: MONO_DESTINATION,
                //comment: 'no comments',
                customerEmails: [email],
      
              },
              paymentType: 'debit',
              agentFeePercent: 0,
              redirectUrl: MONO_REDIRECT_URL, //'https://develop.alioks.com/admin/payments',
              webHookUrl: MONO_WEBHOOK_URL,//'https://develop.alioks.com/rest/bank/webhook'
            });
            break;
          default:
            res = await runer(params);
        }
        
      }
      return {
        command,
        params,
        result: res,
      }
    });

    if (result) {
      return {
        ok: true,
        ...result,
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error run bank command"),
        ERROR_CODE: "ERROR_RUN_BNK_COMMAND"
      }
    );
  }
};

const bankApi = {
  async getMerchantDetails() {
    const url = '/api/merchant/details';
    const request = await bs({
      url,
    });
    return request?.data;
  },
  async createInvoice(params) {
    const url = '/api/merchant/invoice/create';
    const request = await bs({
      url,
      method: 'POST',
      data: {
        ...params,
      }
    });
    return request?.data;
  }
}
