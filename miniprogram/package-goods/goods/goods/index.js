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
    require('./behaviors/spec-list'),
    require('./behaviors/stock-more'),
    require('./behaviors/stock-cart'),
    require('./behaviors/sku-delete'),
    require('./behaviors/sku-more'),
  ],
  properties: {
    spuId: String,
    skuId: String,
    stockId: String,
    tagSuffix: String,
    editable: {
      type: Boolean,
      value: true,
    },
  },
  lifetimes: {
    attached: function () {
      this.data.tag = `goods-${this.properties.tagSuffix}`;
      this.disposers = [
        autorun(() => {
          if (!this.data.spu) {
            const spu = stores.goods.getSpu(this.properties.spuId);
            this.setData({ spu: spu || observable({}) });
          }
        }),
        autorun(() => {
          if (!this.data.sku) {
            const sku = stores.goods.getSku(this.properties.spuId, this.properties.skuId);
            this.setData({ sku: sku || observable({}) });
          }
        }),
        autorun(() => {
          const spuTitle = this.data.spu?.title || '';
          this.setData({ spuTitle });
        }),
        autorun(() => {
          const supplierName = this.data.spu?.supplierName || '';
          this.setData({ supplierName });
        }),
        autorun(() => {
          const skuImageList = this.data.sku.imageList || [];
          this.setData({ skuImageList });
        }),
        autorun(() => {
          const skuStockList = this.data.sku?.stockList || [];
          this.setData({ skuStockList });
        }),
        autorun(() => {
          const skuCartData = stores.cart.getSkuCartData(this.properties.skuId) || {};
          this.setData({ skuCartData });
        }),
      ];
    },
    detached: function () {
      this.disposers.forEach((disposer) => disposer());
    },
  },
});
