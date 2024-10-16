const { default: log } = require('../../../../../common/log/log');
const dayjs = require('dayjs');

module.exports = Behavior({
  data: {
    showStockList: false, // 是否展示库存列表
    stockTotals: 0, // 总库存数
  },
  observers: {
    sku: function () {
      this._initStock();
    },
  },
  methods: {
    _initStock: function () {
      const { sku } = this.data;
      if (!sku.stockList) return;
      let stockTotals = 0;
      const updates = {};
      sku.stockList.forEach((stock, index) => {
        stockTotals += stock.quantity;
        updates[`sku.stockList[${index}].createdAtFormatted`] = stock.createdAt
          ? dayjs(stock.createdAt).format('YYYY-MM-DD HH:mm')
          : '';
      });
      this.setData({
        ...updates,
        stockTotals,
      });
    },
    handleShowStockList: function () {
      this.setData({
        showStockList: !this.data.showStockList,
      });
    },
  },
});
