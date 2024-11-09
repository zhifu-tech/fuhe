import stores from '@/stores/index';
import log from '@/common/log/log';
import pages from '@/common/page/pages';
import { autorun, observable, toJS } from 'mobx-miniprogram';

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
    require('./behaviors/sku'),
    require('./behaviors/sku-submit-add'),
    require('./behaviors/sku-submit-edit'),
    require('./behaviors/stock'),
    require('./behaviors/stock-submit-add'),
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
  lifetimes: {
    attached: function () {
      this.disposers = [
        autorun(() => {
          if (!this.data._spu || !this.data.spu) {
            const { spuId } = this.properties.options;
            if (spuId) {
              const _spu = stores.goods.getSpu(spuId);
              const _spuJs = _spu && toJS(_spu);
              const spu = _spuJs && observable(_spuJs);
              this.data._spu = _spu;
              this.data.spu = spu;
            }
            this.setData({
              _spu: this.data._spu || {},
              spu: this.data.spu || observable({}),
            });
            log.info(this.data.tag, 'spu-init');
          }
        }),
        autorun(() => {
          if (!this.data._sku || !this.data.sku) {
            const { spuId, skuId } = this.properties.options;
            if (spuId && skuId) {
              const _sku = stores.goods.getSku(spuId, skuId);
              const _skuJs = _sku && toJS(_sku);
              const sku = _skuJs && observable(_skuJs);
              this.data._sku = _sku;
              this.data.sku = sku;
            }
            this.setData({
              _sku: this.data._sku || {},
              sku: this.data.sku || observable({}),
            });
            log.info(this.data.tag, 'sku-init');
          }
        }),
        autorun(() => {
          if (!this.data._stock || !this.data.stock) {
            const { spuId, skuId, stockId } = this.properties.options;
            if (spuId && skuId && stockId) {
              const _stock = stores.goods.getStock(spuId, skuId, stockId);
              const _stockJs = _stock && toJS(_stock);
              const stock = _stockJs && observable(_stockJs);
              this.data._stock = _stock;
              this.data.stock = stock;
            }
            this.setData({
              _stock: this.data._stock || {},
              stock: this.data.stock || observable({}),
            });
            log.info(this.data.tag, 'stock-init');
          }
        }),
        autorun(() => {
          const skuImageList = this.data.sku?.imageList || [];
          this.setData({ skuImageList: toJS(skuImageList) });
        }),
        autorun(() => {
          const skuList = this.data.spu?.skuList || [];
          this.setData({ skuList: toJS(skuList) });
        }),
      ];
      this.show(this.properties.options);
    },
    detached: function () {
      this.disposers?.every((disposer) => disposer());
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
    _popup: function (callback) {
      callback(this.selectComponent('#popup'));
    },
  },
});
