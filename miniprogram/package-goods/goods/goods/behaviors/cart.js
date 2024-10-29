const { default: log } = require('@/common/log/log');
const { default: services } = require('@/services/index');

module.exports = Behavior({
  methods: {
    handleCartChangeEvent: function (e) {
      const { stock } = e.target.dataset;
      // 更新Stock的数据
      const { salePrice, saleQuantity } = e.detail;
      if (stock.salePrice !== salePrice) {
        // 记录被调整之前的价格，用来判定价格是否被调整过
        if (!stock.originalSalePrice) {
          stock.originalSalePrice = stock.salePrice;
        } else if (stock.originalSalePrice === salePrice) {
          stock.originalSalePrice = undefined;
        }
        stock.salePrice = salePrice;
        this._saveStockChanges(stock);
      }
      stock.saleQuantity = saleQuantity;
      // 如果选择数为0，从已有库存中删除
      if (saleQuantity === 0) {
        this._removeStockFromCart(stock);
      } else {
        this._updateStockInCart(stock);
      }
      e.detail.spu = this.data.spu;
      e.detail.sku = this.data.sku;
      log.info('handleCartChangeEvent ', e, stock, this.data.sku, this.data.spu);
    },
    _removeStockFromCart: function (stock) {
      const { spu, sku } = this.data;
      // 从SKU的stockList中删除stock
      const stockIndex = sku._cartStockList?.findIndex((item) => item._id === stock._id) || -1;
      if (stockIndex === -1) return;
      sku._cartStockList.splice(stockIndex, 1);
      // 如果删除之后cartStockList为空，从spu中删除sku
      if (sku._cartStockList.length !== 0) return;
      const skuIndex = spu._cartSkuList?.findIndex((item) => item._id === sku._id) || -1;
      if (skuIndex === -1) return;
      spu._cartSkuList.splice(skuIndex, 1);
    },
    _updateStockInCart: function (stock) {
      log.info('updateStockInCart ', stock);
      const { spu, sku } = this.data;
      // SKU首次添加 库存
      if (!sku._cartStockList) {
        sku._cartStockList = [stock];
        // spu首次添加 库存
        if (!spu._cartSkuList) {
          spu._cartSkuList = [sku];
        }
        return;
      }
      // SKU已有库存
      const stockIndex = sku._cartStockList.findIndex((item) => item._id === stock._id);
      if (stockIndex === -1) {
        sku._cartStockList.push(stock);
      } else {
        sku._cartStockList[stockIndex] = stock;
      }
    },
    _saveStockChanges: async function (stock) {
      try {
        await services.stock.update({
          tag: 'stockPricesChange',
          stockId: stock._id,
          salePrice: stock.salePrice,
        });
      } catch (error) {
        log.error('更新库存价格失败', error);
      }
    },
  },
});
