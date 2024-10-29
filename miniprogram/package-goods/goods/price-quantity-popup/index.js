const { default: pages } = require('@/common/page/pages');

Component({
  behaviors: [require('./behaviors/price'), require('./behaviors/quantity')],
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  properties: {
    options: {
      type: Object,
      value: {},
    },
  },
  data: {
    tag: 'priceQuantityPopup',
    salePrice: 0,
    originalPrice: 0,
    saleQuantity: 0,
    originalQuantity: 0,
    _close: () => null,
    _change: () => null,
  },
  observers: {
    options: function (options) {
      this.show(options);
    },
    'saleQuantity, salePrice': function () {
      this.data._change({
        salePrice: this.data.salePrice,
        saleQuantity: this.data.saleQuantity,
      });
    },
  },
  methods: {
    show: function ({ originalPrice, salePrice, originalQuantity, saleQuantity, close, change }) {
      this.setData({
        salePrice,
        originalPrice,
        saleQuantity,
        originalQuantity,
        _close: close ?? (() => null),
        _change: change ?? (() => null),
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
          _close: () => null,
          _change: () => null,
        });
      });
    },

    _popup: function (callback) {
      callback(this.selectComponent('#popup'));
    },
  },
});
