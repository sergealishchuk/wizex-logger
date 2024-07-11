module.exports = (seconds) => {
  let rest = seconds;
  const hours = Math.floor(rest / 3600);
  const min = Math.floor((rest - (hours * 3600)) / 60);
  const sec = Math.floor(rest - (hours * 3600) - (min * 60));
  return `${hours > 0 ? `${hours} h` : ''}${hours > 0 ? ' ' : ''}${min > 0 ? `${min} min` : ''}${min > 0 ? ' ': ''}${sec > 0 ? `${('0' + sec).slice(-2)} sec` : ''}`
};
