import { commonStorage, store, _ } from '~/utils';

export default {
  isBrowser() {
    return typeof (window) !== 'undefined';
  },

  getFavorites() {
    if (!this.isBrowser()) {
      return { favorites: [] };
    }

    const favorites = commonStorage.getObject('favorites');
    if (_.isEmpty(favorites)) {
      commonStorage.setObject('favorites', {
        favorites: [],
      });
    }
    return commonStorage.getObject('favorites');
  },

  updateWishList(wishList) {
    commonStorage.setObject('favorites', {
      favorites: wishList,
    });
    store.set('favorites.numberOfFavorites', wishList.length, true);
  },
};
