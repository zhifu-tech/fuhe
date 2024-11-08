import log from '@/common/log/log';
import cartServices from '../../../services/cart/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    fabStyle:
      'left: unset; right: var(--td-spacer); bottom: calc(80px + env(safe-area-inset-bottom))',
    fabBtnProps: { theme: 'default', size: 'large', variant: 'text' },

    dataList: [], // 购物车数据
    _needFechGoods: true,
  },
  watch: {
    recordList: function (list) {
      // 当购物车数据发生变化时，重新获取购物车商品数据
      this.data._needFechGoods = true;
    },
    mode: function (mode) {
      const { tag, _needFechGoods } = this.data;
      if (mode === 'popup' && _needFechGoods) {
        this.fetchCartGoodsTask = cartServices.fetchCartGodds({
          tag,
          trigger: 'cart-popup',
          callback: this.handleFetchCartGoods.bind(this),
        });
      }
    },
  },
  lifetimes: {
    detached: function () {
      this.fetchCartGoodsTask?.cancel();
      this.fetchCartGoodsTask = null;
    },
  },
  methods: {
    handleFetchCartGoods: function (status) {
      const { code, error, trigger } = status;
      switch (code) {
        case 'loading': {
          break;
        }
        case 'success': {
          const { dataExtList } = status;
          this.setData({
            dataList: dataExtList,
          });
          break;
        }
        case 'error': {
          break;
        }
      }
    },
  },
});
