import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import { autorun } from 'mobx-miniprogram';
import { showToastError, showToastLoading, hideToastLoading } from '@/common/toast/simples';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    isModeEditStock: function () {
      // 绑定提交按钮的函数
      this.data._submitFn = this._submitEditStock.bind(this);
      // 监听数据的变化
      this.addToAutoDisposable(
        autorun(() => {
          const { stock, _stock } = this.data;
          if (!stock || !_stock) return;
          const submitDisabled =
            stock.quantity === _stock.quantity ||
            // 有效性校验
            !this.checkStockQuantity(stock, false);

          if (submitDisabled !== this.data.submitDisabled) {
            this.setData({ submitDisabled });
          }
        }),
      );
    },
    isModeEditStockSuper: function () {
      // 绑定提交按钮的函数
      this.data._submitFn = this._submitEditStock.bind(this);
      // 监听数据的变化
      this.disposer = autorun(() => {
        const { stock, _stock } = this.data;
        const submitDisabled =
          (stock.quantity === _stock.quantity &&
            stock.costPrice === _stock.costPrice &&
            stock.originalPrice === _stock.originalPrice) ||
          // 有效性校验
          !this.checkStockQuantity(stock, false) ||
          !this.checkStockCostPrice(stock, false) ||
          !this.checkStockOriginalPrice(stock, false);

        if (submitDisabled !== this.data.submitDisabled) {
          this.setData({ submitDisabled });
        }
      });
    },
  },
  methods: {
    _submitEditStock: async function () {
      const { tag, stock, _stock } = this.data;
      showToastLoading({});
      try {
        const fields = {};
        if (stock.quantity !== _stock.quantity) {
          fields.quantity = stock.quantity;
        }
        if (stock.costPrice !== _stock.costPrice) {
          fields.costPrice = stock.costPrice;
        }
        if (stock.originalPrice !== _stock.originalPrice) {
          fields.originalPrice = stock.originalPrice;
        }
        await services.stock.updateStockInfo({
          tag,
          stock,
          ...fields,
        });

        hideToastLoading();
      } catch (error) {
        showToastError({ message: '未知错误，稍后重试!' });
        log.error(tag, 'submitEditStock error', error);
      } finally {
        this.hide();
      }
    },
  },
});
