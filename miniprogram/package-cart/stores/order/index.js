import log from '@/common/log/log';
import { action, observable } from 'mobx-miniprogram';

export default (function () {
  const tagStore = 'order-store';
  return observable({
    dataList: observable.array([]),

    addOrder: action(function ({ tag, order }) {
      log.info(tag, tagStore, 'addOrder', order);
      this.dataList.unshift(order);
    }),

    setFetchOrderListData: action(function ({ tag, dataList, total }) {
      log.info(tag, tagStore, 'setFetchOrderListData', dataList, total);
      this.dataList.replace(dataList);
    }),
  });
})();
