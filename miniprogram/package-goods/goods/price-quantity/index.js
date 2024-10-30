const { default: log } = require('@/common/log/log');
const { default: pages } = require('@/common/page/pages');

Component({
  options: {
    virtualHost: true,
    pureDataPattern: /^_/,
  },
  properties: {
    salePrice: {
      type: Number,
      value: 0,
    },
    originalPrice: {
      type: Number,
      value: 0,
    },
    saleQuantity: {
      type: Number,
      value: 0,
    },
    originalQuantity: {
      type: Number,
      value: 0,
    },
  },
  data: {
    priceLabel: '',
  },
  observers: {
    salePrice: function () {
      const { salePrice, originalPrice } = this.data;
      if (originalPrice === 0 || salePrice === 0) {
        this.setData({
          priceLabel: '',
        });
      } else if (salePrice < originalPrice) {
        let discount = (salePrice / originalPrice) * 10;
        if (!Number.isInteger(discount)) {
          discount = Math.round(discount * 10) / 10;
        }
        this.setData({
          priceLabel: `${discount}折`,
        });
      } else {
        let markup = salePrice / originalPrice;
        if (!Number.isInteger(markup)) {
          markup = Math.round(markup * 10) / 10;
        }
        this.setData({
          priceLabel: `${markup}倍`,
        });
      }
    },
  },
  methods: {
    handleClickPrice: function () {
      require('@/package-goods/goods/price-quantity-popup/popup.js', (popup) => {
        const preSalePrice = this.data.salePrice;
        const preSaleQuantity = this.data.saleQuantity;
        popup.show(pages.currentPage(), {
          ...this.data,
          change: this.setData.bind(this),
          close: () => {
            if (
              preSalePrice !== this.data.salePrice ||
              preSaleQuantity !== this.data.saleQuantity
            ) {
              this._notifyCartChange();
            }
          },
        });
      }, ({ mod, errMsg }) => {
        log.error(`path: ${mod}, ${errMsg}`);
      });
    },
    handleUpdateSaleQuantity: function (e) {
      this.setData({
        saleQuantity: e.detail.value,
      });
      this._notifyCartChange();
    },
    _notifyCartChange: function () {
      this.triggerEvent('cart-change', {
        salePrice: this.data.salePrice,
        originalPrice: this.data.originalPrice,
        saleQuantity: this.data.saleQuantity,
        originalQuantity: this.data.originalQuantity,
      });
    },
  },
});
