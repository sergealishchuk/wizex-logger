
// const _ = require("lodash");
// const moment = require('moment');
// const { Op } = require("sequelize");
// const { send_mail_by_template: sendTemplateMail } = require('../__controllers');
const { PAYMENT_OPERATION } = require('../../constants');
const { Users, Invoices, sequelize } = require('../../models');
const { createErrorMessage } = require('../../utils');
const { payment_operation } = require('../__controllers');
// const config = require('../../config/config');

// const { host, port } = config['frontend'];

// const APP_ENV = process.env.APP_ENV;
// const MY_ENV = APP_ENV || "development";

// const storageImgUrl = `${config['storage'].storageImgUrl}${MY_ENV}`;
/*

makePaymentOperation
/admin/makepaymentoperation

*/
module.exports = async (req, res, tokenPayload) => {

  const { body = {} } = req;
  console.log('body:', body);



  try {
    const result = await sequelize.transaction(async (transaction) => {
      const {
        invoiceId,
        modifiedDate,
        reference,
        status,
        amount,
      } = body;
console.log(body);
      let sellerId;
      let invoiceNumber;
      try {
        const data = JSON.parse(reference);
        sellerId = data.sellerId;
        invoiceNumber = data.invoiceNumber;
      } catch (e) { };

      let newOperation = 'processing';
      if (sellerId) {
        newOperation = await Invoices.create({
          invoiceId,
          modifiedDate,
          sellerId,
          status,
          amount,
          content: JSON.stringify(body)
        }, {
          transaction,
        });

        if (status === 'success') {
          const result = await payment_operation({
            res,
            UserID: sellerId,
            sum: amount / 100,
            operation: PAYMENT_OPERATION.ADD_BALANCE,
            invoiceNumber,
            transaction,
          });
        }
      } else {
        res.status(400).json(
          {
            error: createErrorMessage("Seller not found"),
            ERROR_CODE: "ERROR_SELLER_NOT_FOUND"
          }
        );
      }

      return {
        ok: true,
        newOperation,
      }
    });

    if (result) {
      return {
        ...result,
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(
      {
        error: createErrorMessage("Error bank webhook"),
        ERROR_CODE: "ERROR_BNK_WEBHOOK"
      }
    );
  }



  // {
  //   invoiceId: '240628BY7DXseevxyqZg',
  //   status: 'failure',
  //   failureReason: 'На картці недостатньо коштів для завершення покупки',
  //   errCode: '59',
  //   payMethod: 'pan',
  //   amount: 8200,
  //   ccy: 980,
  //   finalAmount: 0,
  //   createdDate: '2024-06-28T05:29:17Z',
  //   modifiedDate: '2024-06-28T05:30:09Z',
  //   reference: 'ref123',
  //   destination: 'За розміщення товарів та послуг на сайті alioks.com',
  //   paymentInfo: {
  //     tranId: '',
  //     terminal: 'MI000000',
  //     bank: 'Універсал Банк',
  //     paymentSystem: 'mastercard',
  //     country: '804',
  //     fee: 107,
  //     paymentMethod: 'pan',
  //     maskedPan: '53754141******59',
  //     agentFee: 0
  //   }
  // }

  // return {
  //   ok: true,
  // }
};