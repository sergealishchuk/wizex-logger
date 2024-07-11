module.exports = [
  {
    name: 'search_query',
    template: 'search_query.mustache',
    params: [
      {
        name: 'query_string',
        type: 'text'
      },
      {
        name: 'splited_query_string',
        type: 'text',
      },
      {
        name: 'size',
        type: 'integer',
      }
    ]
  },
  {
    name: 'get_suggestions',
    template: 'get_suggestions.mustache',
    params: [
      {
        name: 'query_string',
        type: 'text'
      },
      {
        name: 'size',
        type: 'integer',
      }
    ]
  }
];
