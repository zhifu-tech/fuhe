import log from '@/common/log/log';
import services from '@/services/index';
import { autorun } from 'mobx-miniprogram';
import { showToastError, showToastLoading, hideToastLoading } from '@/common/toast/simples';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    isModeEditSpu: function () {
      this.disposer = autorun(() => {
        const { spu, _spu } = this.data;
        const submitDisabled =
          (spu.title === _spu.title && //
            spu.desc === _spu.desc) ||
          // 有效性校验
          !this.checkSpuTitle(spu, false);
        if (submitDisabled !== this.data.submitDisabled) {
          this.setData({ submitDisabled });
        }
      });
    },
  },
  methods: {
    _submitEditSpu: async function () {
      const { tag, spu, _spu } = this.data;
      showToastLoading({});
      try {
        const fields = {};
        if (spu.title !== _spu.title) {
          fields.title = spu.title;
        }
        if (spu.desc !== _spu.desc) {
          fields.desc = spu.desc;
        }
        await services.goods.updateGoodsSpu({
          tag,
          spu: _spu,
          ...fields,
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
