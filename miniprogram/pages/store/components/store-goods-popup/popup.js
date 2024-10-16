const { default: log } = require('../../../../common/log/log');

module.exports = Behavior({
  data: {
    storeGoodsPopupEnabled: false,
  },
  methods: {
    showGoodsAddSpuPopup: function ({ callback }) {
      this.showGoodsPopup({ isModeAddSpu: true, callback });
    },
    showGoodsEditSpuPopup: function ({ spu, callback }) {
      this.showGoodsPopup({ isModeEditSpu: true, spu, callback });
    },
    showGoodsAddSkuPopup: function ({ spu, sku }) {
      this.showGoodsPopup({ isModeAddSku: true, spu, sku });
    },
    showGoodsEditSkuPopup: function ({ spu, sku, callback }) {
      this.showGoodsPopup({ isModeEditSku: true, spu, sku, callback });
    },
    showGoodsEditStockPopup: function ({ spu, sku, stock, callback }) {
      this.showGoodsPopup({ isModeEditStock: true, spu, sku, stock, callback });
    },
    showGoodsEditStockSuperPopup: function ({ spu, sku, stock, callback }) {
      this.showGoodsPopup({ isModeEditStockSuper: true, spu, sku, stock, callback });
    },
    showGoodsPopup: function (args) {
      this.setData(
        {
          storeGoodsPopupEnabled: true,
        },
        () => {
          args = args || {};
          args.close = this.hideGoodsPopup.bind(this);
          this._goodsPopupComponent().show(args);
        },
      );
    },
    hideGoodsPopup: function () {
      setTimeout(() => {
        this._goodsPopupComponent()?.hide();
        if (this.data.storeGoodsPopupEnabled) {
          this.setData({
            storeGoodsPopupEnabled: false,
          });
        }
        log.info(this.data.tag, 'hideGoodsPopup');
      }, 300);
    },
    _goodsPopupComponent: function () {
      return this.selectComponent('#store-goods-popup');
    },
  },
});
