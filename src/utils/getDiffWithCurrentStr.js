import moment from 'moment';
import { getTimeBySec } from './';

module.exports = (date) => {
  const now = moment(new Date());
  const start = moment(date);
  const durration = moment.duration(now.diff(start));

  return getTimeBySec(durration.asSeconds());
};
