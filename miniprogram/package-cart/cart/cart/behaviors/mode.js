import log from '@/common/log/log';
import cartServices from '../../../services/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    mode: 'fab',
    needFetchData: true,
  },
  methods: {
    handleSwitchMode: function () {
      const { mode } = this.data;
      if (mode === 'fab') {
        this.setData({ mode: 'popup' });
        this.selectComponent('#cart-popup').setData({ visible: true });
      } else {
        this.selectComponent('#cart-popup').setData({ visible: false });
        setTimeout(() => this.setData({ mode: 'fab' }), 240);
      }
    },
  },
  lifetimes: {
    ready: function () {
      const { tag, needFetchData } = this.data;
      if (needFetchData) {
        cartServices.fetchCartData({ tag, trigger: 'init' });
      }
    },
  },
  watch: {
    recordList: function (list) {
      log.info('watch recordList', list);
    },
  },
});
