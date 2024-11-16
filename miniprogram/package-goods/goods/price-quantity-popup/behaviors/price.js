import { showToastWarning } from '@/common/toast/simples.js';
module.exports = Behavior({
  data: {
    discount: 0,
    markup: 0,
  },
  observers: {
    salePrice: function () {
      const { salePrice, originalPrice } = this.data;
      if (salePrice === 0 || originalPrice === 0) {
        this.setData({
          discount: 0,
          markup: 0,
        });
      } else if (salePrice < originalPrice) {
        let discount = (salePrice / originalPrice) * 10;
        if (!Number.isInteger(discount)) {
          discount = Math.round(discount * 10) / 10;
        }
        this.setData({
          discount,
          markup: 0,
        });
      } else {
        let markup = salePrice / originalPrice;
        if (!Number.isInteger(markup)) {
          markup = Math.round(markup * 10) / 10;
        }
        this.setData({
          discount: 10,
          markup,
        });
      }
    },
  },
  methods: {
    handleChangeDiscount: function (e) {
      const discount = e.detail.value;
      this.setData({
        salePrice: Math.round(((this.data.originalPrice * discount) / 10) * 100) / 100,
      });
    },
    handleChangeMarkup: function (e) {
      const markup = e.detail.value;
      this.setData({
        salePrice: Math.round(this.data.originalPrice * markup * 100) / 100,
      });
    },
    handleChangeSalePrice: function (e) {
      const salePrice = e.detail.value;
      if (salePrice > this.data.originalPrice * 10) {
        showToastWarning({
          message: '价格不能超过原价10倍',
        });
        // 移除 salePrice的最后一位数
        this.setData({
          salePrice: salePrice.slice(0, -1),
        });
        return;
      }
      if (salePrice < 0) {
        showToastWarning({
          message: '价格不能小于0',
        });
        return;
      }
      this.setData({
        salePrice,
      });
    },
  },
});
