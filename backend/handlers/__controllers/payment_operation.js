const _ = require('lodash');
const {
  PaymentAccounts,
  Payments,
  Invoices,
} = require('../../models');
const { PAYMENT_OPERATION } = require("../../constants");
const {
  createErrorMessage,
  dates: { dateIsBefore, plusMonth },
  getSystemVariables,
} = require('../../utils');

module.exports = async (parameters = {}) => {
  const {
    res,
    UserID,
    sum,
    nextTariff = 10000,
    sellerActivated = true,
    invoiceNumber,
    operation,
    transaction,
  } = parameters;

  const userAccount = await PaymentAccounts.findOne({
    transaction,
    where: {
      userId: UserID,
    },
    attributes: ['id', 'tariff', 'next_tariff', 'tariff_valid_until', 'balance'],
    raw: true,
  });

  const { id, tariff, next_tariff, tariff_valid_until, balance } = userAccount;



  const nextTariffValue = Number(nextTariff);
  const balanceValue = Number(balance);

  let tariffList;

  const { tariffs_standart } = await getSystemVariables('tariffs_standart');
  tariffList = tariffs_standart;

  const tariffRecord = tariffList[nextTariff];

  switch (operation) {

    case PAYMENT_OPERATION.PAYMENT_AND_CONTINUE_TARIFF:
      break;

    case PAYMENT_OPERATION.ACTIVATE_TARIFF:
      if (balanceValue >= tariffRecord) {
        const nextAccountBalance = balanceValue - tariffRecord;
        const tariffValidUntil = plusMonth(new Date(), 1);
        await PaymentAccounts.update({
          balance: nextAccountBalance,
          tariff: nextTariff,
          next_tariff: null,
          tariff_valid_until: tariffValidUntil,
        }, {
          transaction,
          where: {
            userId: UserID,
          },
        });

        await Payments.create({
          userId: UserID,
          date: new Date(),
          payment: 0,
          operationType: 10,
          debit: tariffRecord,
          params: `{"nextTariff": ${nextTariff}}`
        }, {
          transaction,
          where: {
            userId: UserID,
          },
        });

        return {
          SUCCESS_CODE: {
            name: "TARIFF_PLAN_ACTIVATED",
            params: {
              tariff: nextTariff,
              date: tariffValidUntil.format('DD-MM-YYYY'),
            }
          }
        }

      } else {
        res.status(400).json(
          {
            error: createErrorMessage("Not enough funds"),
            ERROR_CODE: "NOT_ENOUGH_FUNDS",
          }
        );
        return;
      }

      break;

    // case PAYMENT_OPERATION.START_TARIFF:

    //   if (tariffRecord && !sellerActivated) {
    //     await PaymentAccounts.update({
    //       tariff: nextTariff,
    //       next_tariff: null,
    //     }, {
    //       transaction,
    //       where: {
    //         sellerId: UserID,
    //       },
    //     });
    //   }

    //   if (tariffRecord && sellerActivated) {
    //     if (nextTariffValue === tariff) {
    //       await PaymentAccounts.update({
    //         next_tariff: null,
    //       }, {
    //         transaction,
    //         where: {
    //           sellerId: UserID,
    //         },
    //       });
    //     } else {
    //       await PaymentAccounts.update({
    //         next_tariff: nextTariff,
    //       }, {
    //         transaction,
    //         where: {
    //           sellerId: UserID,
    //         },
    //       });
    //     }
    //   }
    //   break;


    case PAYMENT_OPERATION.ADD_BALANCE:
      const nextSumma = Number(balance) + sum;
      console.log('add balance nextSumma', nextSumma);
      await PaymentAccounts.update({
        balance: nextSumma,
      }, {
        transaction,
        where: {
          userId: UserID,
        },
      });

      await Payments.create({
        userId: UserID,
        date: new Date(),
        payment: sum > 0 ? sum : 0,
        operationType: sum > 0 ? 1 : 9,
        debit: sum > 0 ? 0 : Math.abs(sum),
        params: `{ "invoiceNumber": "${invoiceNumber}" }`,
      }, {
        transaction,
        where: {
          userId: UserID,
        },
      });

      break;
  }

  return {
    //SUCCESS_CODE: "SUCCESS_PAYMENT_OPERATION"
    operation,
  };


};


// const _ = require('lodash');
// const { Orders, OrderProcessing, Chats, ChatHistory } = require('../../models');

// module.exports = async (parameters = {}) => {
//   const { UserID, orderUid, message = '', markerId, transaction } = parameters;

//   const orderInfo = await Orders.findAll({
//     transaction,
//     where: { orderUid },
//     attributes: ['userId', 'sellerId'],
//     raw: true,
//   });

//   if (orderInfo.length !== 1) {
//     return { error: createErrorMessage("Order not found") }
//   }

//   const { sellerId, userId } = orderInfo[0];
//   const author = UserID === sellerId ? 1 : 0; // user - 0, seller - 1
//   const partnerId = UserID === sellerId ? userId : sellerId;

//   if (UserID !== sellerId && UserID !== userId) {
//     return { error: createErrorMessage("Not permission to access") };
//   }

//   const newMessage = await Chats.create({
//     orderUid,
//     message,
//     from: UserID,
//     to: UserID !== sellerId ? sellerId : userId,
//     markerId: markerId ? markerId : null,
//   }, {
//     transaction,
//   });

//   const processingRecord = await OrderProcessing.create({
//     orderUid,
//     stage: 30,
//     authorId: UserID,
//     partnerId,
//     authorStatus: author,
//     comment: '[add_message]',
//   }, {
//     transaction,
//   });

//   await Orders.update({
//     topId: processingRecord.id,
//     [UserID === sellerId ? 'sellerTopId' : 'buyerTopId']: processingRecord.id,
//   }, {
//     transaction,
//     where: {
//       orderUid,
//     }
//   });

//   const { id: messageId, message: source } = newMessage;

//   const chatHistory = await ChatHistory.create({
//     messageId,
//     source: message,
//     operation: 2,
//     orderProcessingId: processingRecord.id,
//     markerId: markerId ? markerId : null,
//   }, {
//     transaction,
//   });

//   return {
//     ok: true,
//   };
// };
