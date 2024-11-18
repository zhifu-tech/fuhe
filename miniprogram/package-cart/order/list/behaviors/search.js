import log from '@/common/log/log';
import stores from '@/stores/index';
import orderStore from '../../../stores/order/index';

module.exports = Behavior({
  data: {
    searchValue: '', // 当前搜索值
  },
  methods: {
    filterWithSearchKey: function (orderList) {
      if (this.data.searchValue === '') {
        return orderList;
      }
      return orderList.filter((order) => {
        const searchInfo =
          `${order.createdAtFormatted}` + // 订单创建时间
          `由 ${order.userName} 下单` + // 订单创建人
          `客户 ${order.customerName}` + // 订单客户
          `商家 ${order.providerName}`; // 订单商家
        if (searchInfo.includes(this.data.searchValue)) {
          return true;
        }
        return order.itemList.some(({ spuId, skuId, stockId }) => {
          const spu = stores.goods.getSpu(spuId);
          const sku = stores.goods.getSku(spuId, skuId);
          const stock = stores.goods.getStock(spuId, skuId, stockId);
          if (!spu || !sku || !stock) return false;
          if (spu.title.includes(this.data.searchValue)) return true;
          const title = spu.title + sku.optionList.reduce((acc, cur) => acc + ' ' + cur.title, '');
          if (title.includes(this.data.searchValue)) {
            return true;
          }
          // 供应商匹配
          const supplierMatch = sku.supplierName?.includes(this.data.searchValue);
          if (supplierMatch) return true;

          // 库存信息匹配
          const stockMatch = stock.createdAtFormatted?.includes(this.data.searchValue);
          if (stockMatch) return true;

          return false;
        });
      });
    },
    handleSearchChange: function (e) {
      this.data.searchValue = e.detail.value;
      this.setData({
        orderList: this.filterWithSearchKey(orderStore.selected.orderList),
      });
    },
    handleSearchClear: function () {
      if (!this.data.searchValue) {
        return;
      }
      this.setData({
        searchValue: '',
        orderList: orderStore.selected.orderList,
      });
    },
  },
});
