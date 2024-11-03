import stores from '@/stores/index';
import log from '@/common/log/log';
import pages from '@/common/page/pages';

Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  behaviors: [
    ...require('@/common/debug/debug').behaviors({
      tag: 'goods-popup',
      debug: true,
      debugLifecycle: true,
    }),
    require('mobx-miniprogram-bindings').storeBindingsBehavior,
    require('miniprogram-computed').behavior,
    require('./behaviors/submit'),
    require('./behaviors/spu'),
    require('./behaviors/spu-submit-add'),
    require('./behaviors/spu-submit-edit'),
    require('./behaviors/spu-add-sku'),
    require('./behaviors/sku'),
    require('./behaviors/sku-submit-edit'),
    require('./behaviors/sku-submit-add'),
    require('./behaviors/sku-image'),
    require('./behaviors/stock'),
    require('./behaviors/stock-submit-edit'),
    require('./behaviors/option'),
    require('./behaviors/category'),
    require('./behaviors/supplier'),
  ],
  properties: {
    options: {
      type: Object,
      value: {},
    },
  },
  data: {
    tag: 'goods-popup',
  },
  storeBindings: {
    stores,
    fields: {
      _spu: function () {
        const { spuId } = this.properties.options;
        if (spuId) {
          return stores.goods.getSpu(spuId) || {};
        }
        return {};
      },
      spu: function () {
        const { spuId } = this.properties.options;
        if (spuId) {
          const spu = stores.goods.getSpu(spuId) || {};
          return { ...spu };
        }
        return {};
      },
      _sku: function () {
        const { spuId, skuId } = this.properties.options;
        if (spuId && skuId) {
          return stores.goods.getSku(spuId, skuId) || {};
        }
        return {};
      },
      sku: function () {
        const { spuId, skuId } = this.properties.options;
        if (spuId && skuId) {
          const sku = stores.goods.getSku(spuId, skuId) || {};
          return { ...sku };
        }
        return {};
      },
      _stock: function () {
        const { spuId, skuId, stockId } = this.properties.options;
        if (spuId && skuId && stockId) {
          return stores.goods.getStock(spuId, skuId, stockId) || {};
        }
        return {};
      },
      stock: function () {
        const { spuId, skuId, stockId } = this.properties.options;
        if (spuId && skuId && stockId) {
          const stock = stores.goods.getStock(spuId, skuId, stockId) || {};
          return { ...stock };
        }
        return {};
      },
    },
  },
  observers: {
    options: function (options) {
      if (!options.destroy) {
        this.show(options);
      }
    },
  },
  methods: {
    show: function (options) {
      this.setData(options);
      log.info(this.data.tag, 'show', this.data);
      this._popup((popup) => {
        popup.setData({
          visible: true,
          zIndex: pages.zIndexIncr(),
          overlayProps: {
            zIndex: pages.zIndexOverlay(),
          },
        });
      });
    },
    hide: function () {
      this._popup((popup) => {
        if (popup.data.visible) {
          popup.setData({ visible: false });
        }
        this.data.options?.close?.();
        this.setData({
          options: { destroy: true },
        });
      });
    },
    notify: function () {
      this.options?.callback?.();
    },
    _popup: function (callback) {
      callback(this.selectComponent('#popup'));
    },
  },
});
