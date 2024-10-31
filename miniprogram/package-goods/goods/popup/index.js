import store from '@/stores/store';
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
    isModeAddSpu: false,
    isModeEditSpu: false,
    isModeAddSku: false,
    isModeEditSku: false,
    isModeEditStock: false,
    isModeEditStockSuper: false,
  },
  storeBindings: {
    store,
    fields: {
      _spu: function () {
        const { spuId } = this.properties.options;
        if (spuId) {
          return store.goods.getSpu(spuId) || {};
        }
        return {};
      },
      spu: function () {
        const { spuId } = this.properties.options;
        if (spuId) {
          const spu = store.goods.getSpu(spuId) || {};
          return { ...spu };
        }
        return {};
      },
      _sku: function () {
        const { spuId, skuId } = this.properties.options;
        if (spuId && skuId) {
          return store.goods.getSku(spuId, skuId) || {};
        }
        return {};
      },
      sku: function () {
        const { spuId, skuId } = this.properties.options;
        if (spuId && skuId) {
          const sku = store.goods.getSku(spuId, skuId) || {};
          return { ...sku };
        }
        return {};
      },
      _stock: function () {
        const { spuId, skuId, stockId } = this.properties.options;
        if (spuId && skuId && stockId) {
          return store.goods.getStock(spuId, skuId, stockId) || {};
        }
        return {};
      },
      stock: function () {
        const { spuId, skuId, stockId } = this.properties.options;
        if (spuId && skuId && stockId) {
          const stock = store.goods.getStock(spuId, skuId, stockId) || {};
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
    show: function ({
      isModeAddSpu = false,
      isModeEditSpu = false,
      isModeAddSku = false,
      isModeEditSku = false,
      isModeEditStock = false,
      isModeEditStockSuper = false,
      // spu,
      // sku,
      // stock,
      // close,
      // callback,
    }) {
      // log.info('goods-popup show', {
      //   isModeAddSpu,
      //   isModeEditSpu,
      //   isModeAddSku,
      //   isModeEditSku,
      //   isModeEditStock,
      //   isModeEditStockSuper,
      //   spu,
      //   sku,
      //   stock,
      // });
      // this.initSpu(spu);
      // this.initSku(sku);
      // this.initStock(stock ?? {});
      // this.initOptions();
      this.setData({
        isModeAddSpu,
        isModeEditSpu,
        isModeAddSku,
        isModeEditSku,
        isModeEditStock,
        isModeEditStockSuper,
        // spu: this.data.spu,
        // sku: this.data.sku,
        // stock: this.data.stock,
        // _close: close ?? (() => null),
        // _callback: callback ?? (() => null),
      });
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
      // this.data._callback();
    },
    _popup: function (callback) {
      callback(this.selectComponent('#popup'));
    },
  },
});
