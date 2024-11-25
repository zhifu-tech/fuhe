import log from '@/common/log/log';
import stores from '@/stores/index';
import { autorun, observable } from 'mobx-miniprogram';

Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  behaviors: [
    require('miniprogram-computed').behavior, //
    require('@/common/mobx/auto-disposers'),
  ],
  properties: {
    spuId: String,
    skuId: String,
    stockId: String,
    salePrice: Number,
    saleQuantity: Number,
  },

  watch: {
    'spuId,skuId,stockId': function (spuId, skuId, stockId) {
      const tag = `goods-order`;
      const spu = stores.goods.getSpu(spuId) || observable({});
      const sku = stores.goods.getSku(spuId, skuId) || observable({});
      const stock = stores.goods.getStock(spuId, skuId, stockId) || observable({});

      this.setData({ tag, spu, sku, stock });

      this.addToAutoDisposable(
        autorun(() => {
          const category = stores.category.getCategory(spu.cId);
          this.setData({ spuCategoryTitle: category.title || '' });
        }),
      );
    },
  },
});
