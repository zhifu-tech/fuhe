import log from '@/common/log/log';
import { action, observable } from 'mobx-miniprogram';
import orderModel from '../../models/order/index';

export default (function () {
  const tagStore = 'order-store';
  return observable({
    // dataMap为列表数据的存储
    dataMap: observable.map(), // map <filter, order-list>
    _selected: orderModel.filterList[0].value,

    get selected() {
      return this.getOrCreateData(this._selected);
    },
    set selected(filterValue) {
      this._selected =
        orderModel.filterList.find(({ value }) => {
          return value === filterValue;
        }) || this._selected;
    },
    hasFetchedData: function (filter) {
      const data = this.getOrCreateData(filter);
      return data && data.pageNumber !== 0 && data;
    },

    getOrder: function (id) {
      const selected = this.selected;
      const data = this.getOrCreateData(selected);
      return data.orderList.find((item) => item._id === id);
    },

    addOrder: action(function ({ tag, order }) {
      log.info(tag, tagStore, 'addOrder', order);
      // 添加到全部中
      const data = this.getOrCreateData(orderModel.filterList[0]);
      data.orderList.unshift(order);
    }),
    getOrCreateData: action(function (filter) {
      let data = this.dataMap.get(filter.value);
      if (!data) {
        data = observable({
          filter,
          total: 0,
          pageNumber: 0,
          orderList: [],
        });
        this.dataMap.set(filter.value, data);
      }
      return data;
    }),
  });
})();
