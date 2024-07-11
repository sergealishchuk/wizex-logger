
module.exports = async (parameters, res) => {
  let { body = {} } = parameters;
  console.log('log hook', parameters);
  return {
    ok: true,
  }
}