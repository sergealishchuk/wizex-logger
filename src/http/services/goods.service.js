import { _ } from '~/utils';
import User from '~/components/User';
import { post, put, get, _delete } from '~/http/httpRequest';

function getAllProducts() {
  return get(`/goods/getallproducts`)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

function getAllSellerProducts({ locale }) {
  return get(`/goods/getallsellergoods?locale=${locale}`)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

function getUserOrders() {
  return get('/goods/getorders')
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addOrder = (values) => {
  const url = User.isLog()
    ? '/orders/addorder/auth'
    : '/orders/addorder';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

const uploadImage = (values) => {
  const url = '/goods/images/upload';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

const addProduct = (formData) => {
  const url = '/goods/addproduct';

  return post(url, formData, {
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
}

const updateProduct = (formData) => {
  const url = '/googs/updateproduct';

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
}

const publishProduct = (values) => {
  const url = '/goods/publish';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

const deleteProduct = (values) => {
  const url = '/goods/delete';

  return _delete(url, { data: values })
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
}

const getProductShortInfo = ({ productId }) => {
  const url = `/getproductinfo/${productId}`;

  return get(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getProductStatuses = ({ productId }) => {
  const url = `/getproductstatuses/${productId}`;

  return get(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getUserProduct = ({ productId }) => {
  const url = `/getuserproduct/${productId}`;

  return get(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getCntProductByCategory = ({ categoryId }) => {
  const url = `/getcntgoodsbycategory/${categoryId}`;

  return get(url)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getSlider = () => {
  return get(`/slider/getslider`)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const updateSlider = (formData) => {
  const url = '/googs/updateslider';

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

const getFavorites = () => {
  return get(`/goods/getfavorites`)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getFavoritesFull = () => {
  return get('/goods/getfavorites/full')
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const updateFavorite = (values) => {
  const url = '/goods/updatefavorite';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const removeFavorites = (values) => {
  const url = '/goods/removefavorites';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getGoodsByIds = (values) => {
  const url = '/goods/getgoodsbyids';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const getMultipleOrders = (order) => {
  const url = '/goods/getmultipleorders';

  return post(url, { items: [...order] })
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

function getCustomerOrders() {
  return get('/orders/getcustomerorders')
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

function getOrderDetails(orderUid) {
  return get(`/orders/getcustomerorderdetails/${orderUid}`)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

function getOrderProcessingStages(values) {
  const url = '/orders/getprocessingstages';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addOrderProcessingStage = (values) => {
  const url = '/orders/addprocessingstage';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const updateOrderComplete = (values) => {
  const url = '/orders/updateoredercomplete';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addPayment = (values) => {
  const url = '/orders/addpayment';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getPayments = (values) => {
  const url = '/orders/getpayments';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const removePayment = (values) => {
  const url = '/orders/removepayment';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getOrderUpdates = (values) => {
  const url = '/orders/getorderupdates';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addToChat = (values) => {
  const url = '/orders/addtochat';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getChatMessages = (values) => {
  const url = '/orders/getchatmessages';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const removeChatMessage = (values) => {
  const url = '/orders/removechatmessage';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const editChatMessage = (values) => {
  const url = '/orders/editchatmessage';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getSellerOrdersListUpdates = (values = {}) => {
  const url = '/orders/getsellerorderslistupdates';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getBuyerOrdersListUpdates = (values = {}) => {
  const url = '/orders/getbuyerorderslistupdates';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const updateSyncReadingStatus = (values = {}) => {
  const url = '/orders/updatesyncreadingstatus';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getAllSellerStatuses = (values = {}) => {
  const url = '/orders/getallsellerstatuses';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getAllBuyerStatuses = (values = {}) => {
  const url = '/orders/getallbuyerstatuses';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getAllUpdatesStatuses = (values = {}) => {
  const url = '/orders/getallupdatesstatuses';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const cancelOrder = (values) => {
  const url = '/orders/cancelorder';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const undoCancelationOrder = (values) => {
  const url = '/orders/undocancelationorder';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


const getCurrencies = (options = {}) => {
  const url = '/admin/getcurrencies';

  return get(url, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const addCurrency = (values) => {
  const url = '/admin/addcurrency';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const updateCurrency = (values) => {
  const url = '/admin/updatecurrency';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const removeCurrency = (values) => {
  const url = '/admin/removecurrency';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getSellerOrdersCount = (values) => {
  const url = '/orders/getsellerorderscount';

  return post(url, values)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

const getProductsByFilter = async (values, options) => {
  const url = '/goods/getproductsbyfilter';

  return post(url, values, options)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};

function productsExistInCategory(categoryId) {
  return get(`/goods/productsexist/${categoryId}`)
    .then((response) => {
      return response;
    })
    .catch(e => {
      const error = _.get(e, 'XHRResponse.data', { error: { errors: [{ message: "Connection Error" }] } })
      return error;
    })
};


function getHomePageData() {
  return get(`/home/gethomedata`)
    .then((response) => {
      return response;
    })
};

function getGoodDetails(productId, options = {}) {
  return get(`/detail/${productId}`, options)
    .then((response) => {
      return response;
    })
};

export const goodsService = {
  getAllProducts,
  getAllSellerProducts,
  getUserOrders,
  addOrder,
  uploadImage,
  addProduct,
  updateProduct,
  publishProduct,
  deleteProduct,
  getProductShortInfo,
  getUserProduct,
  getCntProductByCategory,
  getSlider,
  updateSlider,
  getFavorites,
  getFavoritesFull,
  updateFavorite,
  removeFavorites,
  getGoodsByIds,
  getMultipleOrders,
  getCustomerOrders,
  getOrderDetails,
  getOrderProcessingStages,
  addOrderProcessingStage,
  updateOrderComplete,
  addPayment,
  getPayments,
  removePayment,
  getOrderUpdates,
  addToChat,
  getChatMessages,
  removeChatMessage,
  editChatMessage,
  getSellerOrdersListUpdates,
  getBuyerOrdersListUpdates,
  updateSyncReadingStatus,
  getAllSellerStatuses,
  getAllBuyerStatuses,
  getAllUpdatesStatuses,
  cancelOrder,
  undoCancelationOrder,
  getCurrencies,
  addCurrency,
  updateCurrency,
  removeCurrency,
  getSellerOrdersCount,
  getProductsByFilter,
  productsExistInCategory,
  getHomePageData,
  getProductStatuses,
  getGoodDetails,
};
