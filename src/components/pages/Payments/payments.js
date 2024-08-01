import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { adminService, userService } from '~/http/services';
import { TablePaymentsStyled } from './payments.styled';
import Link from '~/components/Link';
import { useRouter } from "next/router";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  _,
  getLocalDate,
  toCurrency$,
  confirmDialog,
  informDialog,
  handleStringWithParams,
  dates,
  pushResponseMessages,
} from '~/utils';
import { DIALOG_ACTIONS } from '~/constants';
import { FlexContainer, SmallButton } from '~/components/StyledComponents';
import TariffsGroup from './tariffs';
import guiConfig from "~/gui-config";
import { TextField } from '@mui/material';

const { imagesUrl } = guiConfig;

const c = (price) => price;

let balanceValue = 0; // temporary
let recomendedToAddToBalance = 0; //temporary

const Payments = (props) => {
  const open = props?.data?.query?.open === '';
  const [changeTariff, setChangeTariff] = useState(open);
  const [data, setData] = useState(props.data || { accounts: {} });
  const [selectedTariff, setSelectedTariff] = useState();
  const [needToUpBalace, setNeedTopUpBalance] = useState();
  const [programName, setProgramName] = useState('');
  const [tariffIsActual, setTariffIsActual] = useState(true);

  console.log('props!!!:', props);
  const {
    shopnameFull,
    shopLogo,
    tariffList,
    accounts: {
      paymentAccount,
      paymentAccountSpecial,
    },
    payments,
    sellerActivated,
  } = data;

  const router = useRouter();

  const { t } = useTranslation(['buttons', 'sidebar', 'payments']);

  useEffect(() => {
    getPaymentsRequest();
  }, []);

  const getTariffPrice = () => {
    const findTariff = _.find(tariffList, item => item.tariff === String(paymentAccount.tariff));
    const { price } = findTariff;
    console.log('!!! price:', price);
    return price;
  }

  const getPaymentsRequest = async () => {
    const paymentResult = await userService.getPayments();

    if (paymentResult.ok) {
      setData(paymentResult.data);

      const { tariffList, tariffIsActual, accounts: { paymentAccount }, programName = '' } = paymentResult.data;
      if (paymentAccount.next_tariff) {
        const findTariff = _.find(tariffList, item => item.tariff === String(paymentAccount.next_tariff));
        if (findTariff) {
          const { price } = findTariff;
          const balance = Number(paymentAccount.balance);
          setNeedTopUpBalance(balance < price);
        }
      }
      setTariffIsActual(tariffIsActual);
      setProgramName(programName);

      return paymentResult.data;
    } else {
      pushResponseMessages(paymentResult);
    }
  };

  const makePaymentOperationRequest = async (values) => {
    const makePaymentOperationResult = await adminService.makePaymentOperation(values);

    pushResponseMessages(makePaymentOperationResult);

    if (makePaymentOperationResult.ok) {
      return await getPaymentsRequest();
    }
  };

  const handleSelectedTariff = async (tariffInput) => {
    const tariff = Number(tariffInput);
    const currentTariff = paymentAccount.next_tariff || paymentAccount.tariff;
    const findTariff = _.find(tariffList, item => item.tariff === String(tariff));

    let confirm;
    if (sellerActivated) {
      confirm = await confirmDialog({
        text: paymentAccount.tariff === tariff
          ? t('back_to_current_tariff', { ns: 'payments' })
          : handleStringWithParams(
            t('dec_tariff_message', { ns: 'payments' }),
            {
              current_tariff: paymentAccount.tariff,
              next_tariff: tariff,
              date: getLocalDate(paymentAccount.tariff_valid_until).split(' ')[0],
            }
          )
      });
    } else {
      confirm = await confirmDialog({
        text: handleStringWithParams(
          t('change_tariff_message', { ns: 'payments' }),
          {
            next_tariff: tariff,
          }
        )
      });
    }
    if (confirm === DIALOG_ACTIONS.CONFIRM) {
      makePaymentOperationRequest({
        operation: 'start_tariff',
        tariff,
      });
      setChangeTariff(false);
    } else if (confirm === DIALOG_ACTIONS.CANCEL) {
      setSelectedTariff(currentTariff);
      setChangeTariff(false);
    }
  };

  const runBankCommand = async (values) => {
    const runBankCommandRequest = await userService.bankCommand(values);
    console.log('runBankCommandRequest', runBankCommandRequest);
    return runBankCommandRequest;
  };

  const handleCreateInvoice = async (amount) => {
    const result = await runBankCommand({
      command: 'createInvoice',
      params: {
        amount: amount * 100,
        ccy: 840,
      },
    });
    if (result && result.ok) {
      const { invoiceId, pageUrl } = result.result;
      console.log('invoiceId:', invoiceId);
      console.log('pageUrl:', pageUrl);
      router.push(pageUrl);

    }
  };

  const handleMakeAddBalance = async () => {
    let needToPay;
    const tariffType = paymentAccount.next_tariff ? paymentAccount.next_tariff : paymentAccount.tariff;
    const findTariff = _.find(tariffList, item => item.tariff === String(tariffType));
console.log('findTariff', findTariff, tariffType);
    if (findTariff) {
      const { price } = findTariff;
      const balance = Number(paymentAccount.balance);
      console.log('balance', balance);
      if ((price - balance) > 0) {
        needToPay = Number((price - balance).toFixed(2));
      }
    }

    if (needToPay < 7) {
      needToPay += 7;
    }

    //if (needToPay > 0) {
    console.log('needToPay:', needToPay);
      handleCreateInvoice(7);
    //}
  };

  const handleStartNewTariff = async () => {
    const findTariff = _.find(tariffList, item => item.tariff === String(paymentAccount.next_tariff));
    const { price } = findTariff;
    const balance = Number(paymentAccount.balance);

    if (balance - price >= 0) {
      const confirm = await confirmDialog({
        text: handleStringWithParams(
          t('inc_tariff_message', { ns: 'payments' }),
          {
            current_tariff: paymentAccount.tariff,
            next_tariff: paymentAccount.next_tariff,
            price: c(price),
          }
        )
      });
      if (confirm === DIALOG_ACTIONS.CONFIRM) {
        makePaymentOperationRequest({
          operation: 'activate_tariff',
          tariff: paymentAccount.next_tariff,
        });
        setChangeTariff(false);
      } else if (confirm === DIALOG_ACTIONS.CANCEL) {
        setChangeTariff(false);
      }
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={6}>
          <div>
            <div style={{ marginLeft: '5px', fontSize: '13px' }}>
              <div style={{ marginTop: '12px' }}><b>{t('tariff_plan', { ns: 'payments' })}:</b> {
                paymentAccount.tariff > 0
                  ? handleStringWithParams(
                    t('tariff_item', { ns: 'payments' }),
                    {
                      tariff: paymentAccount.tariff,
                      price: c(getTariffPrice()),
                    }
                  )
                  : t('free_tariff', {ns: 'payments'})
              }
              </div>
              <div style={{ margin: '0' }}><b>{t('active_to', { ns: 'payments' })}:</b> {paymentAccount.tariff_valid_until ? getLocalDate(paymentAccount.tariff_valid_until).split(' ')[0] : <span style={{ color: 'brown' }}><i>{t('tariff_not_activated', { ns: 'payments' })}</i></span>}</div>
              {
                paymentAccount.next_tariff && (
                  <div style={{ marginTop: '6px', backgroundColor: '#fae4a8', padding: '5px 10px', borderRadius: '5px' }}>
                    <div style={{ display: 'flex' }}>
                      <ErrorOutlineIcon style={{ fontSize: '14px', color: '#b64b14', margin: '3px 3px 0' }} />
                      <div>
                        {
                          handleStringWithParams(
                            t('dec_tariff_message_2', { ns: 'payments' }),
                            {
                              next_tariff: paymentAccount.next_tariff,
                              date: getLocalDate(paymentAccount.tariff_valid_until).split(' ')[0],
                            }
                          )
                        }
                      </div>
                    </div>
                    {
                      !_.isUndefined(needToUpBalace) && paymentAccount.next_tariff > paymentAccount.tariff
                        ? (
                          <div style={{ textAlign: 'right', marginTop: '3px' }}>

                            <Button
                              variant="contained"
                              color="success"
                              style={{ fontSize: '11px', height: '21px' }}
                              disabled={needToUpBalace}
                              onClick={handleStartNewTariff}
                            >
                              {t('start_plan_now', { ns: 'buttons' })}
                            </Button>
                            {needToUpBalace
                              ? <div style={{ fontSize: '8px', marginTop: '3px' }}>{'*'} {t('need_up_to_balance', { ns: 'payments' })}</div>
                              : null
                            }
                          </div>
                        )
                        : null
                    }
                  </div>
                )
              }
            </div>

          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div style={{ textAlign: 'right', fontSize: '19px', fontWeight: 'normal', marginRight: '16px' }}>{t('balance', { ns: 'payments' })}: {c(paymentAccount.balance)}</div>

        </Grid>

        <Grid xs={12} style={{ marginTop: '16px' }}>
          <FlexContainer jc="space-between" style={{flexWrap: 'wrap'}}>
            {!tariffIsActual
              ? <span style={{ padding: '0 8px' }}>{t("up_to_balance", { ns: "payments" })}</span>
              : <span></span>
            }
            <SmallButton
              btn="green"
              style={{ marginRight: '6px' }}
              onClick={handleMakeAddBalance}
            >
              {t('top_up_balance', { ns: 'buttons' })}
            </SmallButton>
          </FlexContainer>
        </Grid>
      </Grid>

      {payments.length > 0 ?
        <TablePaymentsStyled>
          <div style={{ margin: '0 0 4px 8px', fontSize: '13px', fontWeight: 'bold' }}>{t('transactions', { ns: 'payments' })}</div>
          <table width="100%">
            <thead></thead>
            <tbody>
              <tr className="head">
                <th>{t('date', { ns: 'payments' })}</th>
                <th>{t('payment', { ns: 'payments' })}</th>
                <th>{t('debit', { ns: 'payments' })}</th>
                <th>{t('detail', { ns: 'payments' })}</th>
              </tr>
              {
                _.map(payments, (item, index) => {
                  const date = getLocalDate(item.date); //.split(' ');
                  return (
                    <>
                      <tr suppressHydrationWarning>
                        <td className="center" style={{ fontSize: '9px' }}><span suppressHydrationWarning>{date}</span></td>
                        <td className="right" style={{ padding: '4px', whiteSpace: 'nowrap' }}>{`${Number(item.payment) === 0 ? '' : c(item.payment)}`}</td>
                        <td className="right" style={{ padding: '4px', whiteSpace: 'nowrap' }}>{`${Number(item.debit) === 0 ? '' : c(item.debit)}`}</td>
                        <td className="left" style={{ padding: '4px' }}>
                          {
                            handleStringWithParams(
                              t(`payment_operation_${item.operationType}`, { ns: 'payments' }),
                              { ...item.params }
                            )
                          }
                        </td>
                      </tr>
                    </>
                  )
                })
              }
            </tbody>
          </table>
        </TablePaymentsStyled>
        : null
      }
    </div>
  )
};

export default Payments;

/*
body: {
  invoiceId: '240628BY7DXseevxyqZg',
  status: 'processing',
  amount: 8200,
  ccy: 980,
  finalAmount: 0,
  createdDate: '2024-06-28T05:29:17Z',
  modifiedDate: '2024-06-28T05:29:42Z',
  reference: 'ref123',
  destination: 'За розміщення товарів та послуг на сайті alioks.com'
}
/bank/webhook
body: {
  invoiceId: '240628BY7DXseevxyqZg',
  status: 'failure',
  failureReason: 'На картці недостатньо коштів для завершення покупки',
  errCode: '59',
  payMethod: 'pan',
  amount: 8200,
  ccy: 980,
  finalAmount: 0,
  createdDate: '2024-06-28T05:29:17Z',
  modifiedDate: '2024-06-28T05:30:09Z',
  reference: 'ref123',
  destination: 'За розміщення товарів та послуг на сайті alioks.com',
  paymentInfo: {
    tranId: '',
    terminal: 'MI000000',
    bank: 'Універсал Банк',
    paymentSystem: 'mastercard',
    country: '804',
    fee: 107,
    paymentMethod: 'pan',
    maskedPan: '53754141******59',
    agentFee: 0
  }
}
/bank/webhook
body: {
  invoiceId: '240628BY7DXseevxyqZg',
  status: 'processing',
  amount: 8200,
  ccy: 980,
  finalAmount: 0,
  createdDate: '2024-06-28T05:29:17Z',
  modifiedDate: '2024-06-28T05:30:48Z',
  reference: 'ref123',
  destination: 'За розміщення товарів та послуг на сайті alioks.com'
}
/bank/webhook
body: {
  invoiceId: '240628BY7DXseevxyqZg',
  status: 'success',
  payMethod: 'pan',
  amount: 8200,
  ccy: 980,
  finalAmount: 8200,
  createdDate: '2024-06-28T05:29:17Z',
  modifiedDate: '2024-06-28T05:30:52Z',
  reference: 'ref123',
  destination: 'За розміщення товарів та послуг на сайті alioks.com',
  paymentInfo: {
    rrn: '074917627729',
    approvalCode: '596844',
    tranId: '426197185739',
    terminal: 'MI000000',
    bank: 'Універсал Банк',
    paymentSystem: 'mastercard',
    country: '804',
    fee: 107,
    paymentMethod: 'pan',
    maskedPan: '53754141******59',
    agentFee: 0
  }
}
*/