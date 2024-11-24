import stores from '@/stores/index';
import { runInAction } from 'mobx-miniprogram';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  watch: {
    skuCartData: function () {
      const { spuId, skuId, sku } = this.data;
      // 当购物车数据变化时，需要同步stock更新数据
      runInAction(() => {
        sku.stockList?.forEach((stock) => {
          const list = stores.cart.getCartRecordList({
            spuId,
            skuId,
            stockId: stock._id,
          });
          if (list && list.length > 0) {
            const { salePrice, saleQuantity } = list[0];
            if (salePrice && stock.salePrice !== salePrice) {
              stock.salePrice = salePrice;
            }
            if (saleQuantity && stock.saleQuantity !== saleQuantity) {
              stock.saleQuantity = saleQuantity;
            }
          }
        });
      });
    },
  },
});
