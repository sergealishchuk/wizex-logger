const moment = require('moment');

const dateIsAfter = (date, value) => date && value ? moment(date).isAfter(moment(value)) : null;
const dateIsBefore = (date, value) => date && value ? moment(date).isBefore(moment(value)) : null;
const dateIsSameOrBefore = (date, value) => date && value ? moment(date).isSameOrBefore(moment(value)) : null;

const getTimePeriod = (startTime, endTimeValue) => {
  const endTime = !endTimeValue ? new Date() : endTimeValue;
  var dif = moment.duration(moment(endTime).diff(moment(startTime)));
  const value = {
    years: dif.years(),
    months: dif.months(),
    days: dif.days(),
    hours: dif.hours(),
    minutes: dif.minutes(),
    seconds: dif.seconds(),
  };

  const list = [
    value.years,
    value.months,
    value.days,
    value.hours,
    value.minutes,
    value.seconds,
  ];

  const startIndex = list.findIndex(item => item > 0);
  const startValue = list[startIndex];

  return {
    ...value,
    list,
    names: ['years', 'months', 'days', 'hours', 'minutes', 'seconds'],
    startIndex,
    startValue,
  };
}


// const dateInFuture = date =>
//   date ? moment().isBefore(moment(date)) : null;

// const getDay = date => (date ? moment(date).format('YYYY-MM-DD') : null);

// const dateIsBeforeOrEqualDay = (date, value) => date && value ? moment(date).isBefore(moment(value), 'day') : null;
// const shortFormat = date => date.split('T')[0];
// const currentMonthRange = () => {
//   const start = moment().startOf('month').format('YYYY-MM-DD');
//   const end = moment().endOf('month').format('YYYY-MM-DD');
//   return [start, end];
// };
// const getCurrentDay = new Date(moment().endOf('day').format());
// const getMinusMonth = new Date(moment().subtract(1, 'month').startOf('day').format());
// const getMinusYear = new Date(moment().subtract(1, 'year').startOf('day').format());

// const getCurrentDayFormatted = moment().format('YYYY-MM-DD');
// const getPlusWeekFormatted = moment()
//   .add(1, 'week')
//   .format('YYYY-MM-DD');

const getPlusOneDayFormatted = (date) => moment(date)
  .add(1, 'd')
  .format('DD-MM-YYYY');

const plusMonth = (date, count = 1) => moment(date)
  .add(count, 'M');

const plusDays = (date, count = 1) => moment(date)
  .add(count, 'd');

const getFormatDate = (date) => moment(date)
  .format('DD-MM-YYYY');

module.exports = {
  dateIsAfter,
  dateIsBefore,
  dateIsSameOrBefore,
  getPlusOneDayFormatted,
  plusMonth,
  getTimePeriod,
  getFormatDate,
  plusDays,
};