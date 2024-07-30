const { SystemVariables } = require('../models');
const { Op } = require("sequelize");

module.exports = async (variablesInput = '') => {
  const condition = typeof (variablesInput) === 'string'
    ? {
      where: {
        name: variablesInput
      }
    }
    : {
      where: {
        name: {
          [Op.in]: variablesInput
        }
      }
    };

  const SystemVariablesRequest = await SystemVariables.findAll({
    ...condition,
    attributes: ['name', 'type', 'value_STRING', 'value_JSON'],
    raw: true,
  });

  let values = {};
  for (let index = 0; index < SystemVariablesRequest.length; ++index) {
    const {name, type, value_STRING, value_JSON} = SystemVariablesRequest[index];
    if (type === 'STRING') {
      values[name] = value_STRING;
    } else if (type === 'JSON') {
      let json = null;
      try {
        json = JSON.parse(value_JSON);
      } catch(e) { }
      values[name] = json;
    }
  }

  return values;
};