const { default: log } = require('@/common/log/log');
const { saasId } = require('../../../../../common/saas/saas');
const { default: services } = require('@/services/index');

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
        stock.salePrice === _stock.salePrice;
      if (submitDisabled !== this.data.submitDisabled) {
        this.setData({
          submitDisabled,
        });
      }
    },
    _submitEditStock: async function () {
      const { tag, stock, _stock } = this.data;
      this.showToastLoading();
      try {
        await services.stock.update({
          tag,
          stockId: stock._id,
          quantity: stock.quantity === _stock.quantity ? undefined : stock.quantity,
          costPrice: stock.costPrice === _stock.costPrice ? undefined : stock.quantity,
          salePrice: stock.salePrice === _stock.salePrice ? undefined : stock.salePrice,
        });
        // 更新之后的信息到_stock
        _stock.quantity = stock.quantity;
        _stock.costPrice = stock.costPrice;
        _stock.salePrice = stock.salePrice;

        this.notify();
        this.hideToast();
      } catch (error) {
        this.showToastError('未知错误，稍后重试!');
      } finally {
        this.hide();
      }
    },
    _submitEditStockSuper: async function () {
      this._submitEditStock();
    },
  },
});
