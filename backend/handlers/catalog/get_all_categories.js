const _ = require("lodash");
const { createErrorMessage } = require('../../utils');
const { get_all_categories } = require('./controllers');

module.exports = async (parameters, res) => {
  try {
    const data = await get_all_categories();
    return {
      ok: true,
      data,
    };
  } catch (error) {
    console.error('ERROR:::::', String(error));
    res.status(400)
      .json({ 
        error: createErrorMessage(String(error)),
        ERROR_CODE: "GET_ALL_CATEGORIES_ERROR"
      });
  }
};
