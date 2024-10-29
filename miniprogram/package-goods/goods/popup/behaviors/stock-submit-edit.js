import services from '@/services/index';
import { showToastError, showToastLoading, hideToastLoading } from '@/common/toast/simples';

module.exports = Behavior({
  observers: {
    'stock.quantity': function () {
      if (this.data.isModeEditStock) {
        this._checkSubmitEditStockEnabled();
      }
      if (this.data.isModeEditStockSuper) {
        this._checkSubmitEditStockSuperEnabled();
      }
    },
  },
  methods: {
    _checkSubmitEditStockEnabled: function () {
      const { stock, _stock } = this.data;
      const submitDisabled = stock.quantity === _stock.quantity;
      if (submitDisabled !== this.data.submitDisabled) {
        this.setData({
          submitDisabled,
        });
      }
    },
    _checkSubmitEditStockSuperEnabled: function () {
      const { stock, _stock } = this.data;
      const submitDisabled =
        stock.quantity === _stock.quantity &&
        stock.costPrice === _stock.costPrice &&
        stock.originalPrice === _stock.originalPrice;
      if (submitDisabled !== this.data.submitDisabled) {
        this.setData({
          submitDisabled,
        });
      }
    },
    _submitEditStock: async function () {
      const { tag, stock, _stock } = this.data;
      showToastLoading({});
      try {
        await services.stock.update({
          tag,
          stockId: stock._id,
          quantity: stock.quantity === _stock.quantity ? undefined : stock.quantity,
          costPrice: stock.costPrice === _stock.costPrice ? undefined : stock.quantity,
          salePrice: stock.originlPrice === _stock.originlPrice ? undefined : stock.originlPrice,
        });
        // 更新之后的信息到_stock
        _stock.quantity = stock.quantity;
        _stock.costPrice = stock.costPrice;
        _stock.originlPrice = stock.originlPrice;

        this.notify();
        hideToastLoading();
      } catch (error) {
        showToastError({ message: '未知错误，稍后重试!' });
      } finally {
        this.hide();
      }
    },
    _submitEditStockSuper: async function () {
      this._submitEditStock();
    },
  },
});
