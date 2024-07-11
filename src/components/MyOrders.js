import { commonStorage, _ } from '~/utils';

export default {
  isBrowser() {
    return typeof (window) !== 'undefined';
  },

  getOrders() {
    if (!this.isBrowser()) {
      return { orders: [] };
    }

    const orders = commonStorage.getObject('orders');
    if (_.isEmpty(orders)) {
      commonStorage.setObject('orders', {
        ordersList: [],
      });
    }
    return commonStorage.getObject('orders');
  },

  addOrder(order) {
    const { ordersList } = this.getOrders();

    commonStorage.setObject('orders', {
      ordersList: [...ordersList, order],
    });
  },

  clearOrders() {
    commonStorage.setObject('orders', {
      ordersList: [],
    });
  },
};
