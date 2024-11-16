import log from '@/common/log/log';
import pages from '@/common/page/pages';
import { showSimpleActionSheet } from '@/common/action-sheet/simples';

module.exports = Behavior({
  data: {
    currentViewId: '',
    currentStep: 0,
    steps: [
      {
        title: '商品信息',
        content: '确认商品信息',
        anchorViewId: 'goods-info',
      },
      {
        title: '订单信息',
        content: '填写订单信息',
        anchorViewId: 'order-info',
      },
    ],
  },
  methods: {
    handleStepChange: function (e) {
      log.info(this.data.tag, 'handleStepChange', e, e.detail.current);
      this.setData({
        currentStep: e.detail.current,
        currentViewId: this.data.steps[e.detail.current].anchorViewId,
      });
    },
  },
});
