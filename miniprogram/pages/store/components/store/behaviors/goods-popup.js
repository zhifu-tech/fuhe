module.exports = Behavior({
  behaviors: [require('../../store-goods-popup/popup')],
  methods: {
    handleShowGoodsPopup: function () {
      this.showGoodsAddSpuPopup({
        
      });
    },
  },
});
