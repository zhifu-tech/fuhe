module.exports = Behavior({
  methods: {
    handleShowGoodsPopup: function () {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        popup.showGoodsAddSpuPopup(this, {});
      }, ({ mod, errMsg }) => {
        console.error(`path: ${mod}, ${errMsg}`);
      });
    },
  },
});
