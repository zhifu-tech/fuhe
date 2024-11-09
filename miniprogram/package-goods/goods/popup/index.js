import stores from '@/stores/index';
import log from '@/common/log/log';
import pages from '@/common/page/pages';
import { observable, toJS } from 'mobx-miniprogram';

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
      _spu2: function () {
        const { spuId } = this.properties.options;
        if (spuId) {
          const _spu = stores.goods.getSpu(spuId) || {};
          log.info(this.data.tag, '_spu-observable', _spu);
          this.setData({ _spu });
        }
        return {};
      },
      spu2: function () {
        if (!this.data.spu) {
          const { spuId } = this.properties.options;
          if (spuId) {
            const spu = stores.goods.getSpu(spuId);
            log.info(this.data.tag, 'spu-observable', spu);
            const spuJs = spu && toJS(spu);
            log.info(this.data.tag, 'spu-js', spuJs);
            const spuJsObservable = spuJs && observable(spuJs);
            log.info(this.data.tag, 'spu-js-observable', spuJsObservable, spuJsObservable === spu);
            // 这里的spu的改动，不对外发布，所以只是在模块内的observable
            this.setData({ spu: spuJsObservable || observable({}) });
          } else {
            this.setData({ spu: observable({}) });
          }
        }
        return {};
      },
      _sku2: function () {
        const { spuId, skuId } = this.properties.options;
        if (spuId && skuId) {
          const _sku = stores.goods.getSku(spuId, skuId) || {};
          log.info(this.data.tag, '_sku-observable', _sku);
          this.setData({ _sku });
        }
        return {};
      },
      sku2: function () {
        if (!this.data.sku) {
          const { spuId, skuId } = this.properties.options;
          if (spuId && skuId) {
            const sku = stores.goods.getSku(spuId, skuId);
            log.info(this.data.tag, 'sku', sku);
            const skuJs = sku && toJS(sku);
            log.info(this.data.tag, 'sku-js', skuJs);
            const skuJsObservable = observable(skuJs);
            log.info(this.data.tag, 'sku-js-observable', skuJsObservable, skuJsObservable === sku);
            this.setData({ sku: skuJsObservable || observable({}) });
          } else {
            this.setData({ sku: observable({}) });
          }
        }
        return {};
      },
      _stock2: function () {
        const { spuId, skuId, stockId } = this.properties.options;
        if (spuId && skuId && stockId) {
          const _stock = stores.goods.getStock(spuId, skuId, stockId) || {};
          log.info(this.data.tag, '_stock-observable', _stock);
          this.setData({ _stock });
        }
        return {};
      },
      stock2: function () {
        if (!this.data.stock) {
          const { spuId, skuId, stockId } = this.properties.options;
          if (spuId && skuId && stockId) {
            const stock = stores.goods.getStock(spuId, skuId, stockId);
            log.info(this.data.tag, 'stock', stock);
            const stockJs = stock && toJS(stock);
            log.info(this.data.tag, 'stock-js', stockJs);
            const stockJsObservable = stockJs && observable(stockJs);
            log.info(
              this.data.tag,
              'stock-js-observable',
              stockJsObservable,
              stockJsObservable === stock,
            );
            this.setData({ stock: stockJsObservable || observable({}) });
          } else {
            this.setData({ stock: observable({}) });
          }
        }
        return {};
      },
    },
  },
  observers: {
    options: function (options) {
      setTimeout(() => {
        if (!options.destroy) {
          this.show(options);
        }
      }, 300);
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
