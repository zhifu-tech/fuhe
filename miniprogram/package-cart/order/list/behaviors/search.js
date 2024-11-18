import log from '@/common/log/log';
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
          `商家 ${order.providerName}` + // 订单商家
          `商品 ${order.spuName}`; // 订单商品
        return searchInfo.includes(this.data.searchValue);
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
