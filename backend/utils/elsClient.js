const els = require('./els');

module.exports = {
  async getAllScripts() {
    const request = await els({
      url: '/_cluster/state/metadata?pretty&filter_path=**.stored_scripts',
    });
    const { data } = request;
    return data;
  },

  async indexExists(options) {
    const { index } = options;
    let indexIsExists = false;
    try {
      const request = await els({
        method: 'head',
        url: `/${index}`,
      });
      indexIsExists = true;
    } catch(e) {};
    
    return indexIsExists;
  },

  async deleteIndex(options) {
    const { index } = options;
    const request = await els({
      method: 'delete',
      url: `/${index}`,
    });
    const { data } = request;
    return data;
  },

  async getSuggestions(options) {
    const { query_string } = options;
    const runScriptGetSuggestions = await this.runScript({
      id: 'get_suggestions',
      index: 'products',
      params: {
        query_string,
        splited_query_string: query_string.split(' ').map(item => `${item}*`).join(' '),
        size: 0,
        suggest: true,
      }
    });
    const { suggest: { simple_phrase }, hits: { total } } = runScriptGetSuggestions;

    let suggestions = [];
    if (simple_phrase.length > 0) {
      suggestions = simple_phrase[0].options;
    }

    return { suggestions, total: total.value };
  },

  async searchQuery(options) {
    const { query_string, filter, sort, from = 1, must, should, min_score = 0, size = 18, aggs } = options;

    const parameters = {
      filter,
      must,
      sort,
      size,
      from,
      should,
      min_score,
      aggs,
    };

    const runScriptSearchQuery = await this.runScript({
      id: 'search_query',
      index: 'products',
      params: parameters,
    });

    return runScriptSearchQuery;
  },

  async runScript(options) {
    const { index, id, params } = options;
    const request = await els({
      url: `/${index}/_search/template`,
      data: {
        id,
        params,
      }
    });
    const { data } = request;
    return data;
  }
};
