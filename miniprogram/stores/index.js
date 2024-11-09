import log from '@/common/log/log';

export default (function () {
  let _category = null;
  let _spec = null;
  let _goods = null;
  let _cart = null;
  let _stock = null;

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

    get stock() {
      if (!_stock) {
        log.error('stock is not ready, should call fetchStock first!');
        this.fetchStock();
      }
      return _stock || {};
    },
    fetchStock: async function () {
      if (!_stock) {
        _stock = await require
          .async('@/package-mix/stores/stock/index.js')
          .then((mod) => mod.default);
      }
      return _stock;
    },

    get cart() {
      if (!_cart) {
        log.error('cart is not ready, should call fetchCart first!');
        this.fetchCart();
      }
      return _cart || {};
    },
    fetchCart: async function () {
      if (!_cart) {
        _cart = await require
          .async('@/package-cart/stores/cart/index.js')
          .then((mod) => mod.default);
      }
      return _cart;
    },
  };
})();
