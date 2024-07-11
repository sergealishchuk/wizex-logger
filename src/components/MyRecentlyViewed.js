import { commonStorage, store, _ } from '~/utils';

export default {
  isBrowser() {
    return typeof (window) !== 'undefined';
  },

  getViewed() {
    if (!this.isBrowser()) {
      return { products: [] };
    }

    const viewed = commonStorage.getObject('viewed');
    if (_.isEmpty(viewed)) {
      commonStorage.setObject('viewed', {
        products: [],
      });
    }
    return commonStorage.getObject('viewed');
  },

  addProduct(product) {
    const { products } = this.getViewed();
    const { productId } = product;
    const existingProductIndex = _.findIndex(products, { productId });
    if (existingProductIndex === -1) {
      commonStorage.setObject('viewed', {
        products: [product, ...products].slice(0, 12),
      });
    }
  },

  updateViewedList(products) {
    const productList = products.slice(0, 12)
    commonStorage.setObject('viewed', {
      products: productList,
    });
  },
};
