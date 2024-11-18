import log from '@/common/log/log';
import orderModel from '../../../models/order/index';
import orderStore from '../../../stores/order/index';
import { autorun } from 'mobx-miniprogram';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    filterList: orderModel.filterList,
    activeFilterValue: orderModel.filterList[0].value,
  },
  watch: {
    hostAttached: function () {
      this.addToAutoDisposable({
        key: 'activeFilter',
        disposer: autorun(() => {
          const activeFilterValue = orderStore.selected.filter.value;
          log.info('activeFilterValue', activeFilterValue);
          this.setData({ activeFilterValue });
        }),
      });
    },
  },
  methods: {
    handleTabClick: function (e) {
      orderStore.selected = e.detail.value;
      log.info('handleTabClick', e.detail.value);
    },
    handleShowGoodsStore: function () {
      wx.switchTab({ url: '/pages/store/index' });
    },
  },
});
