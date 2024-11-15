import log from '@/common/log/log';
import orderStore from '../../stores/order/index';
import orderService from '../../services/order/index';
import { autorun } from 'mobx-miniprogram';

Component({
  behaviors: [require('miniprogram-computed').behavior, require('@/common/mobx/auto-disposers')],
  options: {
    pureDataPattern: /^_/,
  },
  data: {
    tag: 'order-list',
    dataList: [],
  },
  lifetimes: {
    attached: function () {
      const { tag } = this.data;
      this.addToAutoDisposable(
        orderService.fetchOrderList({
          tag,
          trigger: 'init',
          callback: (res) => {
            log.info(tag, res);
          },
        }),
        autorun(() => {
          log.info(tag, 'autorun dataList', orderStore.dataList);
          this.setData({
            dataList: orderStore.dataList,
          });
        }),
      );
    },
  },
});
