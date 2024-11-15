import cartStore from '../../stores/cart/index';
import cartService from '../../services/cart/index';
import { action, observable } from 'mobx-miniprogram';

Component({
  behaviors: [
    require('miniprogram-computed').behavior,
    require('@/common/mobx/auto-disposers'),
    require('./behaviors/fab'),
    require('./behaviors/popup'),
    require('./behaviors/order'),
  ],
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  data: {
    tag: 'cart-cart',
  },
  lifetimes: {
    created: function () {
      this.data.cart = observable({
        mode: 'fab',
        fetchCartDataStatus: 'idle',
        fetchCartGoodsStatus: 'idle',
      });
    },
    attached: function () {
      if (cartStore.dataList.length == 0) {
        this._fetchCartData('init');
      }
    },
  },
  methods: {
    _fetchCartData: function (trigger) {
      this.addToAutoDisposable({
        key: 'fetchCartData',
        disposer: cartService.fetchCartData({
          tag: this.data.tag,
          trigger,
          callback: ({ code }) => {
            this.data.cart.fetchCartDataStatus = code;
          },
        }),
      });
    },
    handleSwitchMode: action(function () {
      this.data.cart.mode = this.data.cart.mode === 'popup' ? 'fab' : 'popup';
    }),
  },
});
