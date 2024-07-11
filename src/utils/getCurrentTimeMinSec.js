
module.exports = () => {
  const date = new Date();
  return `${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
};
