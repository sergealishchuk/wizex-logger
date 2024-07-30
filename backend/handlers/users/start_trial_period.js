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
  dates: { dateIsBefore, plusDays }
} = require('../../utils');
const { TrendingUp } = require("@mui/icons-material");

module.exports = async (req, res, tokenPayload) => {

  const UserID = tokenPayload.id;

  const { body = {} } = req;

  const user = await Users.findOne({
    where: { id: UserID },
    raw: true,
  });

  if (!user) {
    return {
      error: createErrorMessage("User not found"),
      ERROR_CODE: 'USER_NOT_FOUND'
    };
  }

  
  try {
    const result = await sequelize.transaction(async (transaction) => {
      await Users.update({
        trialwasused: true,
      },{
        transaction,
        where: {
          id: UserID,
        }
      });

      await PaymentAccounts.update({
        tariff: 0,
        tariff_valid_until: plusDays(new Date(), 14),
      }, {
        transaction,
        where: {
          userId: UserID,
        }
      });

      return {
        ok: true,
      }
    });
    if (result) {
      return {
        ...result,
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: handleSequelizeErrors(error),
      ERROR_CODE: 'START_TRIAL_ERROR'
    });
  };
};

//   const PaymentsListRequest = await UserPayments.findAll({
//     where: {
//       userId: UserID
//     },
//     //attributes: ['date', 'payment', 'debit', 'operationType', 'params'],
//     order: [
//       ['date', 'DESC']
//     ],
//     raw: true,
//   });

//   const PaymentsList = PaymentsListRequest.map(item => {
//     let params = {};

//     try {
//       params = JSON.parse(item.params);
//     } catch (e) { };

//     return ({
//       ...item,
//       params,
//     })
//   })

//   const PaymentAccountsResult = await PaymentAccounts.findOne({
//     where: {
//       userId: UserID
//     },
//     attributes: ['tariff', 'next_tariff', 'tariff_valid_until', 'balance'],
//     raw: true,
//   });

//   let tariffList = {};

//   const { tariffs_standart } = await getSystemVariables('tariffs_standart');
  
//   tariffList = Object.keys(tariffs_standart).map(item => ({
//     tariff: item,
//     price: tariffs_standart[item],
//   }))

//   return {
//     ok: true,
//     data: {
//       userId: UserID,
//       tariffList,
//       tariffs_standart,
//       payments: PaymentsList,
//       accounts: {
//         paymentAccount: PaymentAccountsResult,
//       }
//     },
//   }
// };
