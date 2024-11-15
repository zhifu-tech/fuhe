import log from '@/common/log/log';

import orderModel from '../../models/order/index';
import orderStore from '../../stores/order/index';

export default async function createOrder({ tag, userId, userName, infoList }) {
  log.info(tag, 'createOrder by', userName);

  try {
    // 创建订单
    const id = await orderModel.create({ tag, userId, userName });
    log.info(tag, 'createOrder create order success');

    // 更新订单项的订单ID
    infoList.forEach((item) => {
      item.orderId = id;
    });

    // 创建订单项
    const idList = await orderModel.createItemList({ tag, infoList });
    log.info(tag, 'createOrder create order item success', idList);

    // 拉取订单，并入库
    const order = await orderModel.get({ tag, id });
    log.info(tag, 'createOrder get order success', order);

    // 添加到store中
    orderStore.addOrder({ tag, order });

    return order;
  } catch (error) {
    log.error(tag, 'createOrder error', error);
    throw error;
  }
}
