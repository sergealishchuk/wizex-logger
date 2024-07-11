import { _ } from '~/utils';
import { post, put, get } from '~/http/httpRequest';

const getAllCategories = () => {
  const url = '/catalog/getallcategories';

  return get(url)
    .then((response) => {
      return response;
    })
};

function getCatalog() {
  return get(`/catalog/getcatalog`)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getCategoriesByParent = async (values) => {
  const url = '/catalog/getcategoriesbyparent';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const getListOfCategoriesByParents = async (values) => {
  const url = '/catalog/getlistofcategoriesbyparents';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const updateCategories = (parentId, formData) => {
  const url = `/catalog/updatecategories/${parentId}`;

  return put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const moveCategory = async (values) => {
  return post('/catalog/movecategory', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const migrateProducts = async (values) => {
  return post('/catalog/migrateproducts', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

export const catalogService = {
  getAllCategories,
  getCatalog,
  getCategoriesByParent,
  getListOfCategoriesByParents,
  updateCategories,
  moveCategory,
  migrateProducts,
};
