import log from '@/common/log/log';
import { autorun } from 'mobx-miniprogram';
import dashboardStore from '../../stores/dashboard/index';
import dashboardService from '../../services/dashboard/index';

export default Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    hostAttached: function () {
      const { tag } = this.data;
      this.addToAutoDisposable(
        autorun(() => {
          const storeData = dashboardStore.storeData;
          log.info(tag, 'observe storeData', storeData);
          this.setData({
            storeSyncTime: storeData.syncTimeFormatted,
            goodsTotal: storeData.goodsTotal,
            orderTotal: storeData.orderTotal,
            entityTotal: storeData.entityTotal,
          });
        }),
      );
      autorun(() => {
        const syncTime = dashboardStore.storeData.syncTime;
        const syncInterval = dashboardStore.storeData.syncInterval;
        // 如果距离上次同步时间超过 阈值 分钟，就重新同步
        if (Date.now() - syncTime > syncInterval) {
          this.refreshStoreData('auto-sync');
        }
      });
    },
  },
  methods: {
    refreshStoreData: function (trigger) {
      this.addToAutoDisposable(
        dashboardService.syncStoreData({
          tag: this.data.tag,
          trigger,
          callback: ({ code, error }) => {},
        }),
      );
    },
  },
});
