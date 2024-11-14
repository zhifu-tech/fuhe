import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { autorun } from 'mobx-miniprogram';
import { showToastError, showToastLoading, hideToastLoading } from '@/common/toast/simples';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    isModeAddSku: function () {
      // 绑定提交按钮的函数
      this.data._submitFn = this._submitAddSku.bind(this);
      // 监听数据的变化
      this.addToAutoDisposable(
        autorun(() => {
          const { spu, _spu } = this.data;
          // 如果数据发生变化，则开启提交
          const submitDisabled = spu.skuList.length === _spu.skuList.length;
          if (submitDisabled !== this.data.submitDisabled) {
            this.setData({
              submitDisabled,
            });
          }
        }),
      );
    },
  },
  methods: {
    _submitAddSku: async function () {
      const { tag, spu } = this.data;
      const tagExtra = `_submitAddSku-${spu.title}`;

      // 显示加载中
      showToastLoading({ message: '更新中' });

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

      // 删除草稿信息
      stores.goods.deleteGoodsSpu({ tag, spuId: spu._id });

      // 拉取最新的商品信息，并且替换
      await services.goods.fetchGoodsSpuListByIdList({
        tag,
        idList: [spu._id.replace(/^-/, '')],
        trigger: 'submitAddSku',
      });

      hideToastLoading();
      this.hide();
    },
  },
});
