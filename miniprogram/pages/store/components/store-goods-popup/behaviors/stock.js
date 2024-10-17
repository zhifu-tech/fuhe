import { showToastError } from '../../../../../common/toast/simples';

module.exports = Behavior({
  data: {
    _stock: {},
    stock: {
      // quantity: '', // 库存数量
      // costPrice: '', // 成本价格
      // salePrice: '', // 销售价格
    },
  },
  methods: {
    initStock: function (stock) {
      this.data._stock = stock;
      this.data.stock = { ...stock };
    },
    handleUpdateStockCostPrice: function (e) {
      const { value: costPrice } = e.detail;
      this.setData({
        'stock.costPrice': costPrice,
      });
    },
    handleUpdateStockSalePrice: function (e) {
      const { value: salePrice } = e.detail;
      this.setData({
        'stock.salePrice': salePrice,
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
    checkStockSalePrice: function (stock) {
      if (!stock.salePrice) {
        showToastError({ message: '请输入销售价格' });
        this.setData({
          'stock.salePriceTips': '销售价格为必填项',
          'stock.salePriceStatus': 'error',
        });
        return false;
      } else {
        if (stock.salePriceTips || stock.salePriceStatus) {
          this.setData({
            'stock.salePriceTips': '',
            'stock.salePriceStatus': '',
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
