import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { autorun } from 'mobx-miniprogram';
import { showToastError, showToastLoading, hideToastLoading } from '@/common/toast/simples';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    isModeAddStock: function () {
      // 绑定提交按钮的函数
      this.data._submitFn = this._submitAddStock.bind(this);
      // 监听数据的变化
      this.disposer = autorun(() => {
        const { stock } = this.data;
        if (!stock) return;
        const submitDisabled =
          // 有效性校验
          !this.checkStockCostPrice(stock, false) ||
          !this.checkStockOriginalPrice(stock, false) ||
          !this.checkStockQuantity(stock, false);

        if (submitDisabled !== this.data.submitDisabled) {
          this.setData({ submitDisabled });
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
    _submitAddStock: async function () {
      const { tag, sku, _sku, stock, _stock } = this.data;
      showToastLoading({});
      try {
        stock.skuId = sku._id;
        await services.stock.createStockInfo({
          tag,
          sku: _sku,
          draft: stock,
        });

        hideToastLoading();
        log.info(tag, 'submitAddStock success');
      } catch (error) {
        showToastError({ message: '未知错误，稍后重试!' });
        log.error(tag, 'submitAddStock error', error);
      } finally {
        this.hide();
      }
    },
  },
});
