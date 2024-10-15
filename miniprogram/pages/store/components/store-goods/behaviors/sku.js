const { default: log } = require('../../../../../common/log/log');

module.exports = Behavior({
  data: {
    salePrice: undefined,
    stockSelected: 0,
  },
  observers: {
    sku: function () {
      const { salePrice } = this.data;
      if (salePrice === undefined) {
        this._initSalePrice();
      }
    },
  },
  methods: {
    _initSalePrice: function () {
      const { sku } = this.data;
      let salePrice = 0;
      sku.stockList?.forEach((stock) => {
        if (salePrice < stock.salePrice) {
          salePrice = stock.salePrice;
        }
      });
      this.setData({
        salePrice,
      });
    },

    handleUpdateSalePrice: function (e) {
      const { value: salePrice } = e.detail;
      this.setData({
        salePrice,
      });
    },

    handleUpdateQuantity: function (e) {
      const { value: stockSelected } = e.detail;
      log.info('handleUpdateQuantity', stockSelected);
      this.setData({
        stockSelected,
      });
      // 根据用户选择的 stockSelected 数量来动态调整每个 stock 的选中数量。
      //	1.	增加数量（total 小于 stockSelected）：从首位开始增加库存的选中数量，直到满足 stockSelected。
      // 2.	减少数量（total 大于 stockSelected）：从末位开始减少库存的选中数量，直到满足 stockSelected。
      const total = this._getTotalStock();
      if (total === stockSelected) return;
      const {
        sku: { stockList },
      } = this.data;
      const changed = {};
      if (total < stockSelected) {
        let delta = stockSelected - total;
        stockList.some((stock, index) => {
          if (stock.stockSelected === undefined) {
            stock.stockSelected = 0;
          }
          if (stock.stockSelected + delta <= stock.quantity) {
            changed[`sku.stockList[${index}].stockSelected`] = stock.stockSelected + delta;
            return true;
          } else {
            delta -= stock.quantity - stock.stockSelected;
            changed[`sku.stockList[${index}].stockSelected`] = stock.quantity;
          }
        });
      } else {
        let delta = total - stockSelected;
        stockList.reverse().some((stock, index) => {
          if (stock.stockSelected === undefined || stock.stockSelected === 0) return false;
          if (stock.stockSelected - delta >= 0) {
            changed[`sku.stockList[${index}].stockSelected`] = stock.stockSelected - delta;
            return true;
          } else {
            delta -= stock.stockSelected;
            changed[`sku.stockList[${index}].stockSelected`] = 0;
          }
        });
      }
      this.setData(changed);
    },
    handleUpdateStockQuantity: function (e) {
      const { value: stockSelected } = e.detail;
      const { index } = e.target.dataset;
      this.setData({
        [`sku.stockList[${index}].stockSelected`]: stockSelected,
      });
      // 更新总的库存
      const total = this._getTotalStock();
      if (total !== this.data.stockSelected) {
        this.setData({
          stockSelected: total,
        });
      }
    },
    _getTotalStock: function () {
      const {
        sku: { stockList },
      } = this.data;
      let total = 0;
      stockList.forEach((stock) => {
        if (stock.stockSelected !== undefined) {
          total += stock.stockSelected;
        }
      });
      return total;
    },
  },
});
