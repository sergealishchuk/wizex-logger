const { elsClient } = require('../../utils');
const { createErrorMessage } = require('../../utils');

module.exports = async (req, res, tokenPayload) => {
  const { body = {} } = req;

  const { text, category = 1 } = body;

  let result;
  try {
    const searchString = text.split(/\s+/g).join(' ');

    const runScriptSearchQuery = await elsClient.runScript({
      id: 'get_suggestions',
      index: 'products',
      params: {
        query_string: searchString,
        splited_query_string: searchString.split(' ').map(item => `${item}*`).join(' '),
        size: 0,
        suggest: true,
      }
    });

    const getSuggestions = await elsClient.getSuggestions({
      query_string: searchString,
    });
    const { suggestions, total } = getSuggestions;


    const { suggest: { simple_phrase } } = runScriptSearchQuery;

    return {
      ok: true,
      suggestionList: suggestions,
    }
  } catch (e) {
    console.log('error:', e);
    res.status(400).json(
      { error: createErrorMessage("Error get suggestions.") }
    );
  }
};
