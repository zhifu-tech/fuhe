const { default: log } = require('@/common/log/log');
const { saasId } = require('../../../../../common/saas/saas');
const { default: services } = require('@/services/index');

module.exports = Behavior({
  observers: {
    'spu.title, spu.desc': function () {
      if (this.data.isModeEditSpu) {
        this._checkSubmitEditSpuEnabled();
      }
    },
  },
  methods: {
    _checkSubmitEditSpuEnabled: function () {
      const { spu, _spu } = this.data;
      const submitDisabled = !(spu.title !== _spu.title || spu.desc !== _spu.desc);
      if (submitDisabled !== this.data.submitDisabled) {
        this.setData({
          submitDisabled,
        });
      }
    },
    _submitEditSpu: async function () {
      const { tag, spu, _spu } = this.data;
      this.showToastLoading();
      try {
        await services.goods.spuUpdate({
          tag,
          spuId: spu._id,
          title: spu.title !== _spu.title ? spu.title : undefined,
          desc: spu.desc !== _spu.desc ? spu.desc : undefined,
        });
        // 更新之后的信息到_spu
        _spu.title = spu.title;
        _spu.desc = spu.desc;
        this.notify();
        this.hideToast();
      } catch (error) {
        log.error(tag, 'update spu error', error);
        this.showToastError('未知错误，稍后重试!');
      } finally {
        this.hide();
      }
    },
  },
});
