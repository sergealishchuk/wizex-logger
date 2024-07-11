module.exports = (value) => {
  if (value === null) {
    return '0.00'
  }
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
