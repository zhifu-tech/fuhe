module.exports = Behavior({
  data: {
    storeGoodsPopupEnabled: false,
  },
  methods: {
    goodsPopupComponent: function () {
      return this.selectComponent('#store-goods-popup');
    },
    showGoodsPopup: function (callback) {
      this.setData(
        {
          storeGoodsPopupEnabled: true,
        },
        () => callback(this.goodsPopupComponent()),
      );
    },
    onGoodsPopupClose: function () {},
  },
});
