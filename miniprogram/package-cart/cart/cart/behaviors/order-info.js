import log from '@/common/log/log';

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
      this._handleStepChange(e.detail.current);
    },
    handleNextStep: function () {
      if (this.data.currentStep === this.data.steps.length - 1) {
        this.handleMakeOrder();
      } else {
        this._handleStepChange(this.data.currentStep + 1);
      }
    },
    _handleStepChange: function (step) {
      this.setData({
        currentStep: step,
        currentViewId: this.data.steps[step].anchorViewId,
      });
    },
  },
});
