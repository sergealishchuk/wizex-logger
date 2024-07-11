import moment from 'moment';

const getDiffTime = (startTime, endTimeValue) => {
  const endTime = !endTimeValue ? new Date() : endTimeValue;
  var dif = moment.duration(moment(endTime).diff(moment(startTime)));
  const value = `${[('0' + dif.hours()).slice(-2), ('0' + dif.minutes()).slice(-2), ('0' + dif.seconds()).slice(-2)].join(':')}.${('000' + dif.milliseconds()).slice(-3)}`;
  return value;
}

export default getDiffTime;
