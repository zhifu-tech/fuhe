const { default: log } = require('../../../../../common/log/log');
module.exports = Behavior({
  methods: {
    handleGoodsAdd: function () {
      const { isModeAddSpu, spu, sku, stock } = this.data;
      if (isModeAddSpu) {
        if (!this.checkSpuTitle(spu)) return;
        if (!this.checkSpuCategory(spu)) return;
        if (!this.checkSpuSpecList(spu)) return;
      }

      if (!this.checkSkuSpecList(spu, sku)) return;
      if (!this.checkSkuImageList(sku)) return;

      if (!this.checkStockCostPrice(stock)) return;
      if (!this.checkStockSalePrice(stock)) return;
      if (!this.checkStockQuantity(stock)) return;

      sku.stockList = sku.stockList || [];
      sku.stockList = [...sku.stockList, stock];

      // 给出本地的ID，在需要id集合操作中这个正常工作
      spu.skuList = spu.skuList || [];
      sku._id = '-' + spu.skuList.length + 1;
      spu.skuList = [...spu.skuList, sku];

      this.initSku();
      this.initStock({});
      this.initOptions();

      this.setData({
        'spu.skuList': spu.skuList,
        sku: this.data.sku,
        stock: this.data.stock,
      });
    },
  },
});
