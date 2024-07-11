import moment from 'moment';

module.exports = (date) => {
  return date ? moment(date).local().format('DD-MM-YYYY HH:mm:ss') : '';
};
