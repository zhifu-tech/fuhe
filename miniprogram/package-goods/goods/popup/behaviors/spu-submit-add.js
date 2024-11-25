import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { autorun } from 'mobx-miniprogram';
import { showToastError, showToastLoading, hideToastLoading } from '@/common/toast/simples';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    isModeAddSpu: function () {
      // 绑定提交按钮的函数
      this.data._submitFn = this._submitAddSpu.bind(this);
      // 监听数据的变化
      this.addToAutoDisposable(
        autorun(() => {
          const { spu } = this.data;
          // 有新增的sku，则开启提交按钮
          const submitDisabled = spu.skuList?.length === 0;
          if (submitDisabled != this.data.submitDisabled) {
            this.setData({
              submitDisabled,
            });
          }
        }),
      );
    },
  },
  methods: {
    _checkSubmitAddSpuEnabled: function () {
      const { spu } = this.data;
      const submitDisabled =
        this.spu.skuList.length == 0 || // 至少包含一个sku
        !this.checkSpuTitle(spu, false) || // 标题是可以修改的，所以提交之前需要检查
        !this.checkSpuCategory(spu, true) || // 有分类信息
        !this.checkSpuSpecList(spu, true); // 规格列表不能为空

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

      // 显示加载中
      showToastLoading({ message: '更新中' });

      // 提交商品Spu信息
      try {
        await services.goods.createGoodsSpu({ tag, spu });
        log.info(tag, tagExtra, 'createGoodsSpu success');
      } catch (e) {
        log.info(tag, tagExtra, 'createGoodsSpu error', e);
        showToastError({ message: '添加商品失败!' });
        return;
      }

      // 提交商品Sku信息
      try {
        await services.goods.createGoodsSkuList({ tag, spu });
        log.info(tag, tagExtra, 'createGoodsSkuList success');
      } catch (e) {
        log.error(tag, tagExtra, 'createGoodsSkuList error', e);
        showToastError({ message: '未知错误，稍后重试!' });
        return;
      }

      // 提交库存信息
      try {
        await services.stock.createStockList({ tag, spu });
        log.info(tag, tagExtra, 'createStockList success');
      } catch (e) {
        log.error(tag, tagExtra, 'createStockList error', e);
        showToastError({ message: '未知错误，稍后重试!' });
        return;
      }

      // 拉取商品信息
      try {
        // 远程会拼接一些spu信息，所以这里需要重新拉取SPU信息
        await services.goods.getGoodsSpu({ tag, _id: spu._id });
        log.info(tag, tagExtra, 'getGoodsSpu success');
      } catch (error) {
        log.error(tag, tagExtra, 'getGoodsSpu error', error);
        showToastError({ message: '未知错误，稍后重试!' });
        return;
      }

      log.info(tag, tagExtra, 'goods submit', spu);
      hideToastLoading();
      this.hide();
    },
  },
});
