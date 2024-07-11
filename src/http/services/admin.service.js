
import { _ } from '~/utils';
import { post, put, get, _delete } from '~/http/httpRequest';

const populateDummyData = async (values) => {
  return post('/admin/populatedummydata', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getDataStatistics = async (values) => {
  return post('/admin/getdatastatistics', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const removeAllProducts = async (values) => {
  return post('/admin/removeallproducts', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const startIndexerForProducts = async (values) => {
  return post('/search/indexer', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const refreshDatabase = async (values) => {
  return post('/admin/refreshdatabase', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const refreshSearchTemplates = async (values) => {
  return post('/admin/refreshsearchtemplates', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getAllTemplates = async (values) => {
  return post('/admin/getalltemplates', values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getAttributes = async () => {
  return get('/admin/getattributes')
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getAttribute = async ({ attributeId }) => {
  const url = `/admin/getattribute/${attributeId}`;

  return get(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addAttribute = async (value) => {
  return post('/admin/addattribute', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const updateAttribute = async (value) => {
  return put('/admin/updateattribute', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const deleteAttribute = async (values) => {
  const { attributeId } = values;
  const url = `/admin/deleteattribute/${attributeId}`;
  return _delete(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const changeAttributesOrder = async (value) => {
  return post('/admin/changeattributesorder', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getAttributesTypes = async (value) => {
  return get('/admin/getattributestypes', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getAttributesByCategory = ({ categoryId }) => {
  const url = `/admin/getattributesbycategory/${categoryId}`;

  return get(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getValuesByAttribute = ({ attributeId }) => {
  const url = `/admin/getvaluesbyattribute/${attributeId}`;

  return get(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

const getAttributeValue = ({ valueId }) => {
  const url = `/admin/getattributevalue/${valueId}`;

  return get(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addAttributeValue = async (value) => {
  return post('/admin/addattributevalue', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const updateAttributeValue = async (value) => {
  return put('/admin/updateattributevalue', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const deleteAttributeValue = async (values) => {
  const { valueId } = values;
  const url = `/admin/deleteattributevalue/${valueId}`;
  return _delete(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const checkAttribute = async (values) => {
  const url = `/admin/checkattribute`;
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const arrangeAttributes = async (values) => {
  const url = '/admin/arrangeattributes';
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const arrangeValues = async (values) => {
  const url = '/admin/arrangevalues';
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const arrangeStructure = async (values) => {
  const url = '/admin/arrangestructure';
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addCategory = async (values) => {
  const url = '/admin/addcategory';
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const updateCategory = async (value) => {
  return put('/admin/updatecategory', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const removeCategory = async (values) => {
  const { categoryId } = values;
  const url = `/admin/deletecategory/${categoryId}`;
  return _delete(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const copyCategory = async (values) => {
  const url = '/admin/copycategory';
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const searchCategory = async (values) => {
  const url = '/admin/searchcategory';
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getArticles = async (values = {}) => {
  const url = '/admin/getarticles';
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const getArticlesTags = async () => {
  return get('/admin/getarticlestags')
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getArticlesTagValue = async ({valueId}) => {
  return get(`/admin/getarticlestagvalue/${valueId}`)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const updateArticleTagValue = async (value) => {
  return put('/admin/updatearticletagvalue', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addArticleTagValue = async (value) => {
  return post('/admin/addarticletagvalue', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const checkArticleTag = async (values) => {
  const url = `/admin/checkarticletag`;
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const deleteArticleTagValue = async (values) => {
  const { valueId } = values;
  const url = `/admin/deletearticletagvalue/${valueId}`;
  return _delete(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const arrangeArticleTagsValues = async (values) => {
  const url = '/admin/arrangearcticletagsvalues';
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addArticle = async (value) => {
  return post('/admin/addarticle', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getArticle = async ({ articleId }) => {
  const url = `/admin/getarticle/${articleId}`;

  return get(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const updateArticle = async (value) => {
  return put('/admin/updatearticle', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const publishArticle = (values) => {
  const url = '/admin/publisharticle';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const deleteArticle = async (values) => {
  const { articleId } = values;
  const url = `/admin/deletearticle/${articleId}`;
  return _delete(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const refuseArticleChanges = async (value) => {
  return put('/admin/refusearticlechanges', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const makeArticleActual = async (value) => {
  return put('/admin/makearticleactual', value)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const searchArticle = async (values) => {
  const url = '/admin/searcharticle';
  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


export const adminService = {
  populateDummyData,
  getDataStatistics,
  removeAllProducts,
  startIndexerForProducts,
  refreshDatabase,
  refreshSearchTemplates,
  getAllTemplates,
  getAttributes,
  getAttribute,
  updateAttribute,
  deleteAttribute,
  changeAttributesOrder,
  addAttribute,
  deleteAttribute,
  changeAttributesOrder,
  getAttributesTypes,
  getAttributesByCategory,
  getValuesByAttribute,
  getAttributeValue,
  addAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
  checkAttribute,
  arrangeAttributes,
  arrangeValues,
  arrangeStructure,
  addCategory,
  updateCategory,
  removeCategory,
  copyCategory,
  searchCategory,
  getArticles,
  getArticlesTags,
  getArticlesTagValue,
  updateArticleTagValue,
  addArticleTagValue,
  checkArticleTag,
  deleteArticleTagValue,
  arrangeArticleTagsValues,
  addArticle,
  getArticle,
  updateArticle,
  publishArticle,
  deleteArticle,
  refuseArticleChanges,
  makeArticleActual,
  searchArticle,
};
