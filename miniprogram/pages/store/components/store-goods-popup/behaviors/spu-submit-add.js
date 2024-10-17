import log from '../../../../../common/log/log';
import { saasId } from '../../../../../common/saas/saas';
import services from '../../../../../services/index';
import { showToastLoading, hideToastLoading } from '../../../../../common/toast/simples';

module.exports = Behavior({
  observers: {
    'spu.skuList': function () {
      if (this.data.isModeAddSpu) {
        this._checkSubmitAddSpuEnabled();
      }
    },
  },
  methods: {
    _checkSubmitAddSpuEnabled: function () {
      const {
        spu: { skuList = [] },
      } = this.data;
      const submitDisabled = skuList.length == 0;
      if (submitDisabled != this.data.submitDisabled) {
        this.setData({
          submitDisabled,
        });
      }
      return;
    },
    _submitAddSpu: async function () {
      const { tag, spu } = this.data;
      // 数据完整性校验
      if (!this.checkSpuTitle(spu)) return;
      if (!this.checkSpuCategory(spu)) return;
      if (!this.checkSpuSpecList(spu)) return;
      showToastLoading({ message: '更新中' });
      // 提交商品Spu信息
      const { id } = await services.goods.spuCreate({
        tag,
        saasId: saasId(),
        cId: spu.category._id,
        title: spu.title,
        desc: spu.desc,
      });
      spu._id = id;

      this._submitAddSkuList(spu);

      log.info(tag, 'goods submit', spu);

      // 提交库存信息
      hideToastLoading();
      this.hide();
    },
  },
});
