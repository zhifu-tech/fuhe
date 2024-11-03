import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { showToastLoading, hideToastLoading } from '@/common/toast/simples';

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
      const tagExtra = `_submitAddSpu-${spu.title}`;

      // 数据完整性校验
      if (!this.checkSpuTitle(spu)) {
        log.info(tag, tagExtra, 'checkSpuTitle failed!');
        return;
      }
      if (!this.checkSpuCategory(spu)) {
        log.info(tag, tagExtra, 'checkSpuCategory failed!');
        return;
      }
      if (!this.checkSpuSpecList(spu)) {
        log.info(tag, tagExtra, 'checkSpuSpecList failed!');
        return;
      }

      // 显示加载中
      showToastLoading({ message: '更新中' });

      // 提交商品Spu信息
      if (spu._id.startsWith('-')) {
        try {
          await services.goods.createGoodsSpu({ tag, spu });
          log.info(tag, tagExtra, 'createGoodsSpu success');
        } catch (e) {
          log.info(tag, tagExtra, 'createGoodsSpu error', e);
          hideToastLoading();
          return;
        }
      }

      // 提交商品Sku信息
      try {
        await services.goods.createGoodsSkuList({ tag, spu });
        log.info(tag, tagExtra, 'createGoodsSkuList success');
      } catch (e) {
        log.error(tag, tagExtra, 'createGoodsSkuList error', e);
        hideToastLoading();
        return;
      }

      // 提交库存信息
      try {
        await services.stock.createStockList({ tag, spu });
      } catch (e) {
        log.error(tag, tagExtra, 'createStockList error', e);
        hideToastLoading();
        return;
      }

      log.info(tag, tagExtra, 'goods submit', spu);
      // 添加信息到store中，并触发更新
      stores.goods.addGoodsSpu({ tag, spu });

      hideToastLoading();
      this.hide();
    },
  },
});
