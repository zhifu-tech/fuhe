import log from '@/common/log/log';
import services from '@/services/index';
import { flow } from 'mobx-miniprogram';

import orderStore from '../../stores/order/index';
import orderModel from '../../models/order/index';

export default function fetchOrderList({ tag, trigger, callback }) {
  let _task = _fetchOrderList({
    tag,
    trigger,
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

const _fetchOrderList = flow(function* ({ tag, trigger, callback, _finally }) {
  // 请求中，切换选中状态
  callback({ code: 'loading', trigger });
  log.info(tag, 'fetchOrderList', 'start');

  try {
    // 拉取订单列表
    const { records: dataList, total } = yield orderModel.list({
      tag,
    });
    log.info(tag, 'fetchOrderList', dataList, total);

    // 拉取spu信息
    const spuIdSet = new Set();
    dataList
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

    orderStore.setFetchOrderListData({ tag, dataList, total });

    callback({ code: 'success', trigger });
    log.info(tag, 'fetchOrderList', 'end');
    return dataList;
  } catch (error) {
    callback({ code: 'error', error, trigger });
    log.error(tag, 'fetchOrderList', error);
    throw error;
  } finally {
    _finally?.();
  }
});
