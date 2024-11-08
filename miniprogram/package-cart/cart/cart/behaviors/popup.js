import log from '@/common/log/log';
import cartServices from '../../../services/cart/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    fabStyle:
      'left: unset; right: var(--td-spacer); bottom: calc(80px + env(safe-area-inset-bottom))',
    fabBtnProps: { theme: 'default', size: 'large', variant: 'text' },

    cartList: [], // 购物车数据
    _dataList: [], // 购物车数据
    _needFechGoods: true,
  },
  watch: {
    recordList: function () {
      this.showCartList();
    },
    mode: function (mode) {
      const { tag, _needFechGoods } = this.data;
      if (mode === 'popup' && _needFechGoods) {
        this.fetchCartGoodsTask?.dispose();
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
      this.fetchCartGoodsTask?.dispose();
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
          this.data._dataList = dataExtList;
          this.showCartList();
          break;
        }
        case 'error': {
          break;
        }
      }
    },
    showCartList: function () {
      const { tag, mode, recordList, _dataList, _needFechGoods } = this.data;
      // 当购物车数据发生变化时，重新获取购物车商品数据
      this.data._needFechGoods = true;
      // 当正在显示时，需要更新数据
      if (mode === 'popup' && _dataList != null) {
        // recordList为原始购物车数据，dataList为处理后的购物车数据
        // 当数据变化时，需要重新获取dataList，但是显示的购物车数据，如果已经获取，则不需要重新获取
        this.setData({
          cartList: recordList,
        });
      }
    },
  },
});
