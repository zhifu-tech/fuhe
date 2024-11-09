import log from '@/common/log/log';
import cartStore from '../../../stores/cart/index';
import cartService from '../../../services/cart/index';
import { autorun } from 'mobx-miniprogram';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    fabStyle:
      'z-index:66; left: unset; right: var(--td-spacer); bottom: calc(80px + env(safe-area-inset-bottom))',
    fabBtnProps: { theme: 'default', size: 'large', variant: 'text' },

    dataList: [], // 购物车数据
    _dataList: [], // 购物车数据
    _needFechGoods: true,
  },
  watch: {
    mode: function (mode) {
      const { tag, _needFechGoods } = this.data;
      if (mode === 'popup') {
        if (_needFechGoods) {
          // 首次运行，拉取数据
          this.fetchCartGoodsTask?.dispose();
          this.fetchCartGoodsTask = cartService.fetchCartGodds({
            tag,
            trigger: 'cart-popup',
            callback: this.handleFetchCartGoods.bind(this),
          });
        } else {
          this.showCartList();
        }
      } else {
        // 隐藏时，清空数据
        setTimeout(() => this.setData({ dataList: [] }), 300);
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
      const { code } = status;
      switch (code) {
        case 'success': {
          this.data._needFechGoods = false;
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
      const { mode, _dataList } = this.data;
      // 当正在显示时，需要更新数据
      if (mode === 'popup' && _dataList != null) {
        this.setData({ dataList: cartStore.dataList });
      }
    },
  },
});
