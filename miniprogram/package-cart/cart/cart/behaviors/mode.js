import log from '@/common/log/log';
import cartServices from '../../../services/cart/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    mode: 'fab',
    _needFetchData: true,
  },
  lifetimes: {
    ready: function () {
      const { tag, _needFetchData } = this.data;
      if (_needFetchData) {
        this.fetchCartDataTask?.dispose();
        this.fetchCartDataTask = cartServices.fetchCartData({
          tag,
          trigger: 'init',
          callback: this.handleFetchCartData.bind(this),
        });
      }
    },
    detached: function () {
      this.fetchCartDataTask?.dispose();
      this.fetchCartDataTask = null;
    },
  },
  methods: {
    handleSwitchMode: function () {
      const { tag, mode } = this.data;
      if (mode === 'fab') {
        this.setData({ mode: 'popup' });
        this.selectComponent('#cart-popup').setData({ visible: true });
      } else {
        this.selectComponent('#cart-popup').setData({ visible: false });
        setTimeout(() => this.setData({ mode: 'fab' }), 240);
      }
    },
    handleFetchCartData: function (status) {
      const { code, error, trigger } = status;
      switch (code) {
        case 'error': {
          this.data._needFetchData = true;
          break;
        }
      }
    },
  },
});
