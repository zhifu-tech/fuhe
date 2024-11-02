import store from '@/stores/store';
import log from '@/common/log/log';

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
        const spu = store.goods.getSpu(this.properties.spuId);
        // TRICKY: 返回一个新对象:
        // 1. 当spu变化时，可以触发更新
        // 2. 避免引用修改导致的不一致问题
        return { ...spu } || {};
      },
      sku: function () {
        const { spuId, skuId } = this.properties;
        if (spuId && skuId) {
          const sku = store.goods.getSku(spuId, skuId);
          return sku || {};
        } else {
          return {};
        }
      },
      cartSkuSumInfo: function () {
        return store.cart.getCartSkuSumInfo(this.properties.skuId) || {};
      },
    },
  },
});
