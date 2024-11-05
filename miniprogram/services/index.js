import log from '@/common/log/log';
import goods from './goods/index';
import category from './category/index';
import spec from './spec/index';
import stock from './stock/index';
import option from './option/index';
import entity from './entity/index';

export default (function () {
  let _cart2 = null;
  let _good2 = null;
  return {
    spec,
    goods,
    category,
    stock,
    option,
    entity,

    runInCart: function (action) {
      this.cart2.then(action);
    },

    get cart2() {
      _cart2 =
        _cart2 ||
        require
          .async('@/package-cart/services/index.js')
          .then((mod) => mod.default || mod)
          .catch(({ mod, errMsg }) => {
            log.error('services', `加载分包 ${mod} 失败`, errMsg);
            return null;
          });
      return _cart2;
    },

    get goods2() {
      _good2 =
        _good2 ||
        require
          .async('@/package-goods-2/services/index.js')
          .then((mod) => mod.default || mod)
          .catch(({ mod, errMsg }) => {
            log.error('services', `加载分包 ${mod} 失败`, errMsg);
            return null;
          });
      return _good2;
    },
  };
})();
