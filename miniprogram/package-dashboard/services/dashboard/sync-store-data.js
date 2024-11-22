import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import dashboardStore from '../../stores/dashboard/index';
import dashboardModel from '../../models/dashboard/index';
import { flow } from 'mobx-miniprogram';

export default function syncStoreData({ tag, trigger, callback }) {
  let _task = _syncStoreData({
    tag,
    trigger,
    callback,
    _finally: () => {
      _task = null;
    },
  });
  return {
    key: 'syncStoreData',
    dispose: () => {
      _task?.cancel();
      _task = null;
    },
  };
}

const _syncStoreData = flow(function* ({
  tag, //
  trigger,
  callback,
  _finally,
}) {
  callback({ code: 'loading', trigger });
  log.info(tag, 'syncStoreData', trigger);

  // 拉取商品信息
  try {
    let syncData = yield dashboardModel.getStoreData({
      tag,
      syncTime: Date.now(),
    });

    log.info(tag, 'syncStoreData', syncData, !syncData.syncTime);
    // 如果没有拉取到数据，则构造数据
    if (!syncData.syncTime) {
      const [
        { total: goodsTotal }, //
        { total: orderTotal },
        { total: entityTotal },
      ] = yield Promise.all([
        services.goods.fetchGoodsSpuListFlow({
          tag,
          trigger,
          pageNumber: 1,
          cId: stores.category.categoryAll._id,
          callback: () => null,
          _finally: () => null,
        }),
        services.order.fetchOrderListFlow({
          tag,
          trigger,
          pageNumber: 1,
          filter: { archived: false },
          callback: () => null,
          _finally: () => null,
        }),
        services.entity.fetchEntityListFlow({
          tag,
          trigger,
          callback: () => null,
          _finally: () => null,
        }),
      ]);
      syncData = yield dashboardModel.setStoreData({
        tag,
        syncTime: Date.now(),
        goodsTotal,
        orderTotal,
        entityTotal,
      });
    }
    dashboardStore.setStoreData({ tag, ...syncData });
    callback({ code: 'success', trigger });
    log.info(tag, 'syncStoreData', 'end');
  } catch (error) {
    callback({ code: 'error', error, trigger });
    log.error(tag, 'syncStoreData', error);
    throw error;
  } finally {
    _finally?.();
  }
});
