import stores from '@/stores/index';
import { showToastError } from '@/common/toast/simples';

module.exports = Behavior({
  methods: {
    handleUpdateStockCostPrice: function (e) {
      const { value: costPrice } = e.detail;
      const { tag, stock } = this.data;
      stores.stock.updateStockInfo({
        tag,
        stock,
        costPrice: +costPrice, // change to number
      });
    },
    handleUpdateStockOriginalPrice: function (e) {
      const { value: originalPrice } = e.detail;
      const { tag, stock } = this.data;
      stores.stock.updateStockInfo({
        tag,
        stock,
        originalPrice: +originalPrice,
      });
    },
    handleUpdateStockQuantity: function (e) {
      const { value: quantity } = e.detail;
      const { tag, stock } = this.data;
      stores.stock.updateStockInfo({
        tag,
        stock,
        quantity: +quantity,
      });
    },
    checkStockCostPrice: function (stock, useToast = true) {
      if (!stock.costPrice) {
        if (useToast) {
          showToastError({ message: '请输入成本价格' });
        }
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
    checkStockOriginalPrice: function (stock, useToast = true) {
      if (!stock.originalPrice) {
        if (useToast) {
          showToastError({ message: '请输入商品定价' });
        }
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
    checkStockQuantity: function (stock, useToast = true) {
      if (!stock.quantity) {
        if (useToast) {
          showToastError({ message: '请输入库存数量' });
        }
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
