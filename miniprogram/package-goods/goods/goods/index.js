import store from '@/stores/store';

Component({
  behaviors: [
    require('mobx-miniprogram-bindings').storeBindingsBehavior,
    require('miniprogram-computed').behavior,
    require('./behaviors/spec-list'),
    require('./behaviors/stock'),
    require('./behaviors/stock-more'),
    require('./behaviors/sku-summary'),
    require('./behaviors/sku-add'),
    require('./behaviors/sku-delete'),
    require('./behaviors/sku-more'),
    require('./behaviors/stock-cart'),
  ],
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  properties: {
    spuId: String,
    skuId: String,
    editable: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    tag: 'goods',
  },
  storeBindings: {
    store,
    fields: {
      spu: function () {
        return store.goods.getSpu(this.properties.spuId);
      },
      sku: function () {
        return store.goods.getSku(this.properties.spuId, this.properties.skuId);
      },
      cartSkuSumInfo: function () {
        return store.cart.getCartSkuSumInfo(this.properties.skuId) || {};
      },
    },
  },
});
