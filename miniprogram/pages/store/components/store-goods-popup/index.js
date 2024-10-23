const { default: log } = require('@/common/log/log');
const { default: pages } = require('../../../../common/page/pages');

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
    require('./behaviors/category-picker'),
    require('./behaviors/supplier'),
  ],
  data: {
    tag: 'goods-popup',
    isModeAddSpu: false,
    isModeEditSpu: false,
    isModeAddSku: false,
    isModeEditSku: false,
    isModeEditStock: false,
    isModeEditStockSuper: false,
    _close: () => null,
    _callback: () => null,
  },
  methods: {
    show: function ({
      isModeAddSpu = false,
      isModeEditSpu = false,
      isModeAddSku = false,
      isModeEditSku = false,
      isModeEditStock = false,
      isModeEditStockSuper = false,
      spu,
      sku,
      stock,
      close,
      callback,
    }) {
      this.initSpu(spu);
      this.initSku(sku);
      this.initStock(stock ?? {});
      this.initOptions();
      this.setData({
        isModeAddSpu,
        isModeEditSpu,
        isModeAddSku,
        isModeEditSku,
        isModeEditStock,
        isModeEditStockSuper,
        spu: this.data.spu,
        sku: this.data.sku,
        stock: this.data.stock,
        _close: close ?? (() => null),
        _callback: callback ?? (() => null),
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
          popup.setData({
            visible: false,
          });
        }
        this.data._close();
        this.setData({
          isModeAddSpu: false,
          isModeEditSpu: false,
          isModeAddSku: false,
          isModeEditSku: false,
          isModeEditStock: false,
          isModeEditStockSuper: false,
          spu: {},
          sku: {},
          stock: {},
          _close: () => null,
          _callback: () => null,
        });
      });
    },
    notify: function () {
      this.data._callback();
    },
    _popup: function (callback) {
      callback(this.selectComponent('#goods-popup'));
    },
  },
});
