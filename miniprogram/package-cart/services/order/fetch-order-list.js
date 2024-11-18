import log from '@/common/log/log';
import services from '@/services/index';
import { flow } from 'mobx-miniprogram';
import dayjs from 'dayjs';

import orderStore from '../../stores/order/index';
import orderModel from '../../models/order/index';

export default function fetchOrderList({
  tag, //
  trigger,
  filter,
  pageNumber,
  callback,
}) {
  let _task = _fetchOrderList({
    tag,
    trigger,
    filter,
    pageNumber,
    callback,
    finally: () => {
      _task = null;
    },
  });
  return {
    key: 'fetchOrderList',
    dispose: () => {
      _task?.cancel();
    },
  };
}

const _fetchOrderList = flow(function* ({
  tag, //
  trigger,
  filter,
  pageNumber,
  callback,
  _finally,
}) {
  // 请求中，切换选中状态
  callback({ code: 'loading', trigger });
  log.info(tag, 'fetchOrderList', 'start');

  // 等待30s
  // yield new Promise((resolve) => setTimeout(resolve, 30000));

  try {
    // 拉取订单列表
    const { records: orderList, total } = yield orderModel.list({
      tag,
      pageNumber,
      status: filter.status,
      archived: filter.archived,
    });
    // 格式化数据
    orderList.forEach((order) => {
      order.createdAtFormatted = dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss');
    });

    log.info(tag, 'fetchOrderList', orderList, total);

    // 拉取spu信息
    const spuIdSet = new Set();
    orderList
      .flatMap(({ itemList }) => itemList)
      .forEach(({ spuId }) => {
        spuIdSet.add(spuId);
      });
    log.info(tag, 'fetchOrderList', 'spuIdList', spuIdSet);

    const spuList = yield services.goods.getGoodsSpuList({
      tag,
      trigger,
      idList: Array.from(spuIdSet),
      callback: () => null,
    });
    log.info(tag, 'fetchOrderList', 'spuList', spuList);

    const data = orderStore.getOrCreateData(filter);
    if (pageNumber === 1) {
      data.total = total;
      data.pageNumber = pageNumber;
      data.orderList.replace(orderList);
    } else {
      data.total = total;
      data.pageNumber = pageNumber;
      data.orderList.replace([...data.orderList, ...orderList]);
    }

    callback({ code: 'success', trigger });
    log.info(tag, 'fetchOrderList', 'end');
  } catch (error) {
    callback({ code: 'error', error, trigger });
    log.error(tag, 'fetchOrderList', error);
    throw error;
  } finally {
    _finally?.();
  }
});
