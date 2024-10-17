import { showGoodsAddSpuPopup } from '../../store-goods-popup/popups';

module.exports = Behavior({
  methods: {
    handleShowGoodsPopup: function () {
      showGoodsAddSpuPopup({});
    },
  },
});
