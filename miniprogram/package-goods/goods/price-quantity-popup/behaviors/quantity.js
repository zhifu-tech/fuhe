import { showToastWarning } from '@/common/toast/simples.js';

module.exports = Behavior({
  methods: {
    handleChangeSaleQuantity: function (e) {
      const saleQuantity = e.detail.value;
      if (saleQuantity > this.data.originalQuantity) {
        showToastWarning({
          message: '目前不支持超卖，即数量不能超过库存',
        });
        // 移除 saleQuantity的最后一位数
        this.setData({
          saleQuantity: saleQuantity.slice(0, -1),
        });
        return;
      }
      this.setData({
        saleQuantity: e.detail.value,
      });
    },
  },
});
