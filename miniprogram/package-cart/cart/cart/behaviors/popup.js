import log from '@/common/log/log';
import cartStore from '../../../stores/cart/index';
import cartService from '../../../services/cart/index';
import { autorun, observe } from 'mobx-miniprogram';

module.exports = Behavior({
  data: {
    fabStyle:
      'z-index:66; left: unset; right: var(--td-spacer); bottom: calc(80px + env(safe-area-inset-bottom))',
    fabBtnProps: { theme: 'default', size: 'large', variant: 'text' },
    showCartPopup: false,
    recordList: [],
  },
  lifetimes: {
    attached: function () {
      const cart = this.data.cart;
      this.addToAutoDisposable(
        autorun(() => {
          if (cart.mode === 'popup') {
            this._showPopup();
          } else {
            this._hidePoup();
          }
        }),
        autorun(() => {
          if (cart.fetchCartDataStatus === 'success') {
            this._showPopup();
          } else if (cart.fetchCartGoodsStatus === 'success') {
            this._showPopup();
          }
        }),
        observe(cartStore.dataList, () => {
          // 购物车数据发生变，更新数据
          if (this.data.showCartPopup) {
            log.info(this.data.tag, 'cart数据发生变，更新数据');
            this.setData({
              recordList: cartStore.dataList,
            });
          }
        }),
      );
    },
  },
  methods: {
    _showPopup: function () {
      const { tag, cart, showCartPopup } = this.data;
      if (showCartPopup) return;
      if (cart.mode !== 'popup') return;
      if (cart.fetchCartDataStatus === 'idle' || cart.fetchCartDataStatus === 'error') {
        log.info(tag, '未拉取过购物车数据，或者拉取失败，重新拉取');
        this._fetchCartData('popup');
        return;
      }
      if (cart.fetchCartGoodsStatus === 'idle' || cart.fetchCartGoodsStatus === 'error') {
        log.info(tag, '未拉取过购物车商品，或者拉取失败，重新拉取');
        this.addToAutoDisposable({
          key: 'fetchCartGoods',
          disposer: cartService.fetchCartGodds({
            tag,
            trigger: 'cart-popup',
            callback: ({ code }) => {
              cart.fetchCartGoodsStatus = code;
            },
          }),
        });
        return;
      }
      log.info(tag, '显示购物车弹窗');
      this.setData({
        showCartPopup: true,
        recordList: cartStore.dataList,
      });
      this.selectComponent('#cart-popup').setData({ visible: true });
    },
    _hidePoup: function () {
      // 已经隐藏，无需处理
      if (!this.data.showCartPopup) return;
      // 隐藏弹窗
      this.selectComponent('#cart-popup').setData({ visible: false });
      // 240ms后，再切换回fab模式，给动画流出时间
      setTimeout(() => {
        this.setData({
          showCartPopup: false,
          recordList: [],
        });
      }, 240);
    },
  },
});
