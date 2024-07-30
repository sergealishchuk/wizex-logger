const bs = require('./bnk_service');

module.exports = {
  async getMerchantDetails() {
    const request = await bs({
      url: '/api/merchant/details',
    });
    return request?.data;
  },
};