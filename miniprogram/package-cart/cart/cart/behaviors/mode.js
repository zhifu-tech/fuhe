import log from '@/common/log/log';
import cartStore from '../../../stores/cart/index';
import cartService from '../../../services/cart/index';
import { autorun } from 'mobx-miniprogram';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    mode: 'fab',
    showCartFab: false,
  },
  lifetimes: {
    attached: function () {
      let isFirstRun = true;
      this.carrDisposer = autorun(() => {
        const dataList = cartStore.dataList;
        // 1. 无数据，首次运行，拉取数据
        if (dataList.length === 0 && isFirstRun) {
          this.fetchCartDataTask = cartService.fetchCartData({
            tag: this.data.tag,
            trigger: 'init',
          });
        }
        // 2. 控制fab的显示/隐藏
        if (dataList.length > 0 && !this.data.showCartFab) {
          this.setData({ showCartFab: true });
        } else if (dataList.length === 0 && this.data.showCartFab) {
          this.setData({ showCartFab: false });
        }
        // 标记为非首次展示
        isFirstRun = false;
      });
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
        // 240ms后，再切换回fab模式，给动画流出时间
        setTimeout(() => this.setData({ mode: 'fab' }), 240);
      }
    },
  },
});
