import log from '@/common/log/log';

export default (function () {
  let _category = null;
  let _spec = null;
  let _goods = null;
  let _stock = null;
  let _cart = null;
  return {
    get category() {
      if (!_category) {
        log.error('category service is not read, call fetchCategory() first');
      }
      return _category;
    },
    fetchCategory: async function () {
      if (!_category) {
        _category = await require
          .async('@/package-cso/services/category/index.js')
          .then((mod) => mod.default || mod);
      }
      return _category;
    },
    get spec() {
      if (!_spec) {
        log.error('spec service is not read, call fetchSpec() first');
      }
      return _spec;
    },
    fetchSpec: async function () {
      if (!_spec) {
        _spec = await require
          .async('@/package-cso/services/spec/index.js')
          .then((mod) => mod.default || mod);
      }
      return _spec;
    },
    get stock() {
      if (!_stock) {
        log.error('stock service is not read, call fetchStock() first');
      }
      return _stock;
    },
    fetchStock: async function () {
      if (!_stock) {
        _stock = await require
          .async('@/package-mix/services/stock/index.js')
          .then((mod) => mod.default || mod);
      }
      return _stock;
    },

    get goods() {
      if (!_goods) {
        log.error('goods service is not read, call fetchGoods() first');
      }
      return _goods;
    },
    fetchGoods: async function () {
      if (!_goods) {
        _goods = await require
          .async('@/package-goods/services/goods/index.js')
          .then((mod) => mod.default || mod);
      }
      return _goods;
    },

    get cart() {
      if (!_cart) {
        log.error('cart service is not read, call fetchCart() first');
      }
      return _cart;
    },
    fetchCart: async function () {
      if (!_cart) {
        _cart = await require
          .async('@/package-cart/services/cart/index.js')
          .then((mod) => mod.default || mod)
          .catch(({ mod, errMsg }) => {
            log.error('services', `加载分包 ${mod} 失败`, errMsg);
            return null;
          });
      }
      return _cart;
    },
    runInCart: function (action) {
      this.fetchCart().then(action);
    },
  };
})();
