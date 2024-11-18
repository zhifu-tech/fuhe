import log from '@/common/log/log';
import orderStore from '../../../stores/order/index';
import orderService from '../../../services/order/index';
import { showToastError, showToastLoading, showToastSuccess } from '@/common/toast/simples';
import { autorun, flow } from 'mobx-miniprogram';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    unarchivedEnabled: false,
  },
  watch: {
    hostAttached: function () {
      this.addToAutoDisposable(
        autorun(() => {
          // 当处于「归档tab」时，启用「移除归档」按钮
          const unarchivedEnabled = orderStore.selected.filter.archived === true;
          if (this.data.unarchivedEnabled != unarchivedEnabled) {
            this.setData({ unarchivedEnabled });
          }
        }),
      );
    },
  },
  methods: {
    handleArchiveOrder: flow(function* (e) {
      const { tag } = this.data;
      const { orderId } = e.target.dataset;
      const order = orderStore.getOrder(orderId);
      if (!order) {
        showToastError('订单不存在');
        return;
      }
      const { archived } = order;
      showToastLoading({ message: `${archived ? '归档移除中..' : '归档中'}` });

      try {
        yield orderService.archiveOrder({ tag, order });
        showToastSuccess({ message: `${archived ? '移除成功' : '归档成功'}` });
      } catch (error) {
        showToastError({ message: `未知错误，请稍后再试！` });
        log.error(tag, 'archiveOrder', error);
      }
    }),
  },
});
