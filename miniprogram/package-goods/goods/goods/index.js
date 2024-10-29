const { default: services } = require('@/services/index');
const { default: log } = require('@/common/log/log');
import store from '@/services/goods/store';

Component({
  behaviors: [
    require('mobx-miniprogram-bindings').storeBindingsBehavior,
    require('miniprogram-computed').behavior,
    require('./behaviors/specs'),
    require('./behaviors/stock'),
    require('./behaviors/stock-more'),
    require('./behaviors/sku-summary'),
    require('./behaviors/sku-add'),
    require('./behaviors/sku-delete'),
    require('./behaviors/sku-more'),
    require('./behaviors/cart'),
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
    spu: {},
    sku: {},
    stock: {},
  },
  storeBindings: {
    store,
    actions: {
      getSpu: 'getSpu',
      getSku: 'getSku',
    },
  },
  watch: {
    'spuId,skuId': function (spuId, skuId) {
      this.setData({
        spu: this.getSpu(spuId),
        sku: this.getSku(skuId),
      });
    },
  },
});
