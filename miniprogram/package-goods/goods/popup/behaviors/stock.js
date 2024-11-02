import { showToastError } from '@/common/toast/simples';

module.exports = Behavior({
  methods: {
    handleUpdateStockCostPrice: function (e) {
      const { value: costPrice } = e.detail;
      this.setData({
        'stock.costPrice': costPrice,
      });
    },
    handleUpdateStockOriginalPrice: function (e) {
      const { value: originalPrice } = e.detail;
      this.setData({
        'stock.originalPrice': originalPrice,
      });
    },
    handleUpdateStockQuantity: function (e) {
      const { value: quantity } = e.detail;
      this.setData({
        'stock.quantity': quantity,
      });
    },
    checkStockCostPrice: function (stock) {
      if (!stock.costPrice) {
        showToastError({ message: '请输入成本价格' });
        this.setData({
          'stock.costPriceTips': '成本价格为必填项',
          'stock.costPriceStatus': 'error',
        });
        return false;
      } else {
        if (stock.costPriceTips || stock.costPriceStatus) {
          this.setData({
            'stock.costPriceTips': '',
            'stock.costPriceStatus': '',
          });
        }
        return true;
      }
    },
    checkStockOriginalPrice: function (stock) {
      if (!stock.originalPrice) {
        showToastError({ message: '请输入商品定价' });
        this.setData({
          'stock.originalPriceTips': '商品定价为必填项',
          'stock.originalPriceStatus': 'error',
        });
        return false;
      } else {
        if (stock.originalPriceTips || stock.originalPriceStatus) {
          this.setData({
            'stock.originalPriceTips': '',
            'stock.originalPriceStatus': '',
          });
        }
        return true;
      }
    },
    checkStockQuantity: function (stock) {
      if (!stock.quantity) {
        showToastError({ message: '请输入库存数量' });
        this.setData({
          'stock.quantityTips': '销售价格为必填项',
          'stock.quantityStatus': 'error',
        });
        return false;
      } else {
        if (stock.quantityTips || stock.quantityStatus) {
          this.setData({
            'stock.quantityTips': '',
            'stock.quantityStatus': '',
          });
        }
        return true;
      }
    },
  },
});
