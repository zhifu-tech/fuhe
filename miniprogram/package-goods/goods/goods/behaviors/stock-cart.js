import log from '@/common/log/log';
import services from '@/services/index';
import stores from '@/stores/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    skuCartData: function (data) {
      // log.info(this.data.tag, 'watch-skuCartData', data);
    },
  },
  methods: {
    handleCartChangeEvent: function (e) {
      const { stockId } = e.target.dataset;
      const { tag, spuId, skuId } = this.data;
      const stock = stores.goods.getStock(spuId, skuId, stockId);
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
        // 库存价格被修改，更新stock的售价
        this._saveStockChanges(stock);
      }
      stock.saleQuantity = saleQuantity;
      stores.cart.handleCartChange({
        tag,
        spuId,
        skuId,
        stockId: stock._id,
        salePrice: salePrice,
        saleQuantity: saleQuantity,
      });
      // FOR-TEST
      services.runInCart((cart) => {
        cart.updateCartRecord({
          tag,
          spuId,
          skuId,
          stockId: stock._id,
          salePrice: stock.salePrice,
          saleQuantity: stock.saleQuantity,
        });
      });
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
