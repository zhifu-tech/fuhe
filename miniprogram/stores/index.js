import log from '@/common/log/log';
import cart from './cart-store';

export default (function () {
  let _category = null;
  let _spec = null;
  let _goods = null;
  let _cart = null;

  return {
    get category() {
      if (!_category) {
        log.error('category is not ready, should call fetchCategory first!');
        this.fetchCategory();
      }
      return _category || {};
    },
    fetchCategory: async function () {
      if (!_category) {
        _category = await require
          .async('@/package-cso/stores/category/index.js')
          .then((mod) => mod.default);
      }
      return _category;
    },
    get spec() {
      if (!_spec) {
        log.error('spec is not ready, should call fetchSpec first!');
        this.fetchSpec();
      }
      return _spec || {};
    },
    fetchSpec: async function () {
      if (!_spec) {
        _spec = await require
          .async('@/package-cso/stores/spec/index.js')
          .then((mod) => mod.default);
      }
      return _spec;
    },

    get goods() {
      if (!_goods) {
        log.error('goods is not ready, should call fetchGoods first!');
        this.fetchGoods();
      }
      return _goods;
    },
    fetchGoods: async function () {
      if (!_goods) {
        _goods = await require
          .async('@/package-goods/stores/goods/index.js')
          .then((mod) => mod.default);
      }
      return _goods;
    },

    get cart() {
      return cart;
    },

    // get cart() {
    //   if (!_cart) {
    //     log.error('cart is not ready, should call fetchCart first!');
    //     this.fetchCart();
    //   }
    //   return _cart || {};
    // },
    // fetchCart: async function () {
    //   if (!_cart) {
    //     _cart = await require.async('@/package-cart/stores/index.js').then((mod) => mod.default);
    //   }
    //   return _cart;
    // },
  };
})();
