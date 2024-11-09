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
      this.disposer = autorun(() => {
        const { spu } = this.data;
        if (!spu || !spu.skuList) return;
        // 有新增的sku，则开启提交按钮
        const submitDisabled = spu.skuList.length == 0;
        if (submitDisabled != this.data.submitDisabled) {
          this.setData({
            submitDisabled,
          });
        }
      });
    },
  },
  lifetimes: {
    detached: function () {
      this.disposer?.();
      this.disposer = null;
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
      if (spu._id.startsWith('-')) {
        // 增加判定，防止提交失败之后之后，重复提交
        try {
          await services.goods.createGoodsSpu({ tag, spu });
          log.info(tag, tagExtra, 'createGoodsSpu success');
        } catch (e) {
          log.info(tag, tagExtra, 'createGoodsSpu error', e);
          showToastError({ message: '未知错误，稍后重试!' });
          return;
        }
      } else {
        log.info(tag, tagExtra, 'updateGoodsSpu', 'spu has updated before, do nothing!');
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

      log.info(tag, tagExtra, 'goods submit', spu);
      // 添加信息到store中，并触发更新
      stores.goods.addGoodsSpu({ tag, spu });

      hideToastLoading();
      this.hide();
    },
  },
});
