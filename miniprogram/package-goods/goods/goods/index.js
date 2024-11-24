import log from '@/common/log/log';
import stores from '@/stores/index';
import { autorun, observable } from 'mobx-miniprogram';

Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  behaviors: [
    require('miniprogram-computed').behavior,
    require('@/common/mobx/auto-disposers'),
    require('./behaviors/spec-list'),
    require('./behaviors/stock-more'),
    require('./behaviors/stock-action'),
    require('./behaviors/stock-cart'),
    require('./behaviors/sku-delete'),
    require('./behaviors/sku-more'),
  ],
  properties: {
    spuId: String,
    skuId: String,
    tagSuffix: String,
    editable: {
      type: Boolean,
      value: true,
    },
  },
  watch: {
    'spuId,skuId,tagSuffix': function (spuId, skuId, tagSuffix) {
      const tag = `goods-${tagSuffix}`;
      const spu = stores.goods.getSpu(spuId) || observable({});
      const sku = stores.goods.getSku(spuId, skuId) || observable({});

      this.setData({
        tag,
        spu,
        sku,
      });

      this.addToAutoDisposable(
        autorun(() => {
          const spuTitle = spu.title || '';
          this.setData({ spuTitle });
        }),
        autorun(() => {
          const supplierName = spu.supplierName || '';
          this.setData({ supplierName });
        }),
        autorun(() => {
          const skuImageList = sku.imageList || [];
          this.setData({ skuImageList });
        }),
        autorun(() => {
          const skuStockList = sku.stockList || [];
          log.info(this.data.tag, 'skuStockList', skuStockList.length);
          this.setData({ skuStockList });
        }),
        autorun(() => {
          const skuCartData = stores.cart.getSkuCartData(skuId) || {};
          log.info(tag, 'skuCartData', skuCartData);
          this.setData({ skuCartData });
        }),
      );
    },
  },
});
