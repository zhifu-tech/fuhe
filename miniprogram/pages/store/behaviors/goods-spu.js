import { showGoodsAddSpuPopup } from '@/pages/store/components/store-goods-popup/popups';

module.exports = Behavior({
  methods: {
    handleShowGoodsPopup: function () {
      showGoodsAddSpuPopup({});
    },
  },
});
