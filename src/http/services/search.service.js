import { _ } from '~/utils';
import { post, put, get } from '~/http/httpRequest';

const searchQuery = (values) => {
  return post('search/query', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const getSearchSuggestions = async (values) => {
  return post('/search/getsearchsuggestions', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

export const searchService = {
  searchQuery,
  getSearchSuggestions,
};
