import log from '@/common/log/log';
import services from '@/services/index';
import { showToastError, showToastLoading, hideToastLoading } from '@/common/toast/simples';

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
      showToastLoading({});
      try {
        await services.goods.updateGoodsSpu({
          tag,
          spu,
          title: spu.title !== _spu.title ? spu.title : undefined,
          desc: spu.desc !== _spu.desc ? spu.desc : undefined,
        });
        hideToastLoading();
      } catch (error) {
        log.error(tag, 'update spu error', error);
        showToastError({ message: '未知错误，稍后重试!' });
      } finally {
        this.hide();
      }
    },
  },
});
