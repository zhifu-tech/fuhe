import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import cartStore from '../../stores/cart/index';
import { flow } from 'mobx-miniprogram';

export default function fetchCartGoods({ tag, trigger, callback }) {
  let _task = _fetchCartGoods({
    tag,
    trigger,
    callback,
    _finally: () => {
      _task = null;
    },
  });
  return {
    key: 'fetchCartGoods',
    dispose: () => {
      _task?.cancel();
      _task = null;
    },
  };
}

const _fetchCartGoods = flow(function* ({
  tag,
  trigger,
  disposable,
  callback = () => null,
  _finally,
}) {
  // 请求中，切换选中状态
  callback({ code: 'loading', trigger });
  log.info(tag, 'fetchCartGoods', 'start');

  try {
    const dataList = cartStore.dataList;
    const unStoreSpu = [];
    dataList.forEach(({ spuId, skuId, stockId }, index) => {
      const spu = stores.goods.getSpu(spuId);
      const sku = stores.goods.getSku(spuId, skuId);
      const stock = stores.goods.getStock(spuId, skuId, stockId);
      // 如果有信息不存在，则增加一次尝试拉取
      if (!spu || !sku || !stock) {
        unStoreSpu.push({ spuId, index });
      } else {
        dataList[index].spu = spu;
        dataList[index].sku = sku;
        dataList[index].stock = stock;
      }
    });
    log.info(tag, 'fetchCartGoods', 'unstored spu size', unStoreSpu.length);
    if (unStoreSpu.length > 0) {
      yield services.goods.fetchGoodsSpuListAsync({
        tag,
        trigger,
        idList: unStoreSpu.map(({ spuId }) => spuId),
        disposable,
      });

      // 再次教研信息是否存在，如果不存在，标记为不可用
      unStoreSpu.reverse().forEach(({ spuId, index }) => {
        const { skuId, stockId } = dataList[index];
        const spu = stores.goods.getSpu(spuId);
        const sku = stores.goods.getSku(spuId, skuId);
        const stock = stores.goods.getStock(spuId, skuId, stockId);
        if (!spu || !sku || !stock) {
          dataList.splice(index, 1);
          log.info(tag, 'fetchCartGoods', 'unstored spu', spuId, !spu, !sku, !stock);
        } else {
          dataList[index].spu = spu;
          dataList[index].sku = sku;
          dataList[index].stock = stock;
        }
      });
    }

    // 请求成功，切换选中状态
    callback({
      code: 'success',
      trigger,
      dataExtList: dataList,
    });
    log.info(tag, 'fetchCartGoods result');
  } catch (error) {
    if (error.name === 'TASK_CANCELLED') {
      // 判断任务是否被取消
      callback({ code: 'cancelled', trigger });
    } else {
      // 请求失败，切换选中状态
      callback({ code: 'error', error, trigger });
    }
    log.error(tag, '_fetchGoodsSpuListByIdList', error);
  } finally {
    _finally?.();
  }
});
