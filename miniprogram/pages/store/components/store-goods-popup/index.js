const { default: log } = require('@/common/log/log');

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
    require('@/common/popup/popup-props'),
    require('@/common/toast/toasts'),
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
  ],
  properties: {
    isAddSpuMode: {
      type: Boolean,
      value: false,
    },
    isEditSpuMode: {
      type: Boolean,
      value: false,
    },
    isAddSkuMode: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    tag: 'goods-popup',
    visible: false,
    isModeAddSpu: false,
    isModeEditSpu: false,
    isModeAddSku: false,
    isModeEditSku: false,
    isModeEditStock: false,
    isModeEditStockSuper: false,
    _close: () => null,
    _callback: () => null,
  },
  observers: {
    visible: function () {
      const { visible } = this.data;
      if (!visible) {
        this.data._close();
        this.setData({
          _close: () => null,
          _callback: () => null,
        });
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
        visible: true,
        _close: close ?? (() => null),
        _callback: callback ?? (() => null),
      });
    },
    notify: function () {
      this.data._callback();
    },
    hide: function () {
      if (this.data.visible) {
        this.setData({
          visible: false,
        });
      }
    },
  },
});
