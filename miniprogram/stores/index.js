import log from '@/common/log/log';
import { configure, observable } from 'mobx-miniprogram';
import { default as goods } from './goods-store';
import { default as cart } from './cart-store';
import { default as category } from './category-store';
import { default as spec } from './spec-store';

configure({
  enforceActions: true, // 不允许在动作之外进行状态修改
});
export default (function () {
  let _cart = observable({
    needLoad: true,
    data: null,
  });
  let _goods2 = observable({
    needLoad: true,
    data: null,
  });

  return {
    category,
    spec,
    goods,
    cart,
    get cart2() {
      if (_cart.needLoad) {
        _cart.needLoad = false;
        require('@/package-cart/stores/index.js', (cart) => {
          _cart.data = cart.default || cart;
        }, ({ mod, errMsg }) => {
          console.error(`path: ${mod}, ${errMsg}`);
        });
      }
      return _cart.data || {};
    },
  };
})();
