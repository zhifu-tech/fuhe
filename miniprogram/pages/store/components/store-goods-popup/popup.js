import log from '../../../../common/log/log';

module.exports = Behavior({
  data: {
    storeGoodsPopupEnabled: false,
  },
  methods: {
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
