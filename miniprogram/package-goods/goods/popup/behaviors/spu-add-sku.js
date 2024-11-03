import stores from '@/stores/index';
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
      // FIXME: 临时先不校验图片
      // if (!this.checkSkuImageList(sku)) return;

      if (!this.checkStockCostPrice(stock)) return;
      if (!this.checkStockOriginalPrice(stock)) return;
      if (!this.checkStockQuantity(stock)) return;

      sku.stockList = sku.stockList || [];
      sku.stockList = [...sku.stockList, stock];

      if (!spu._id) {
        spu._id = '-1';
      }
      spu.skuList = spu.skuList || [];
      sku._id = `-${spu.skuList.length + 1}`;
      spu.skuList = [...spu.skuList, sku];
      stock._id = '-1';
      // 保存草稿，MobX需要手动触发更新
      stores.goods.setSpuDraft(spu._id, spu);

      this.setData({
        'spu.skuList': spu.skuList,
        sku: {},
        stock: {},
      });
    },
  },
});
