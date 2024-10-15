Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  behaviors: [
    require('@/common/popup/popup-props'),
    require('@/common/toast/toasts'),
    require('./goods/submit'),
    require('./goods/spu'),
    require('./goods/spu-submit-add'),
    require('./goods/spu-submit-edit'),
    require('./goods/spu-add-sku'),
    require('./goods/sku'),
    require('./goods/sku-submit-edit'),
    require('./goods/sku-submit-add'),
    require('./goods/sku-image'),
    require('./goods/stock'),
    require('./goods/option'),
    require('./goods/category'),
    require('./goods/category-picker'),
    ...require('@/common/debug/debug').behaviors({
      tag: 'goods-popup',
      debug: true,
      debugLifecycle: true,
    }),
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
      spu,
      sku,
      stock,
      close,
      callback,
    }) {
      this.initSpu(spu ?? {});
      this.initSku(sku ?? {});
      this.initStock(stock ?? {});
      this.initOptions();
      this.setData({
        isModeAddSpu,
        isModeEditSpu,
        isModeAddSku,
        isModeEditSku,
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
