import log from '@/common/log/log';

import orderModel from '../../models/order/index';
import orderStore from '../../stores/order/index';
import { runInAction } from 'mobx-miniprogram';

export default async function archiveOrder({ tag, order }) {
  log.info(tag, 'archivedOrder', 'start');

  try {
    // 更新订单状态
    await orderModel.update({
      tag,
      _id: order._id,
      archived: !order.archived,
    });

    // 同步状态
    runInAction(() => {
      order.archived = !order.archived;
      orderModel.filterList.forEach((filter) => {
        const data = orderStore.getOrCreateData(filter);
        const index = data.orderList.findIndex((item) => item._id === order._id);
        switch (filter.value) {
          case 'all': {
            // 对于全部订单列表
            if (index === -1) {
              data.orderList.unshift(order);
            } else {
              data.orderList[index].archived = order.archived;
            }
            break;
          }
          case 'archived': {
            if (order.archived) {
              if (index === -1) {
                data.orderList.unshift(order);
              } else {
                data.orderList[index].archived = order.archived;
              }
            } else if (index !== -1) {
              data.orderList.splice(index, 1);
            }
            break;
          }
          default: {
            // 对于其他列表，如果是‘归档’,则移除
            if (order.archived) {
              data.orderList.splice(index, 1);
            } else {
              data.orderList[index].archived = order.archived;
            }
          }
        }
      });
    });
    log.info(tag, 'archivedOrder', 'success');
  } catch (error) {
    log.error(tag, 'archivedOrder', error);
    throw error;
  }
}
