import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';
import cartStore from '../../stores/cart/index';
import Disposable from '@/common/disposable/index';

export default function fetchCartGoods({ tag, trigger, callback }) {
  log.info(tag, 'fetchCartGoods', trigger);

  const disposable = new Disposable();

  _fetchCartGoods({ tag, trigger, callback, disposable });
  return disposable;
}

async function _fetchCartGoods({
  tag, //
  trigger,
  disposable,
  callback = () => null,
}) {
  // 请求中，切换选中状态
  callback({ code: 'loading', trigger });

  try {
    const dataList = cartStore.dataList;
    const dataExtList = [...dataList];
    const unStoreSpu = [];
    dataExtList.forEach(({ spuId, skuId, stockId }, index) => {
      const spu = stores.goods.getSpu(spuId);
      const sku = stores.goods.getSku(spuId, skuId);
      const stock = stores.goods.getStock(spuId, skuId, stockId);
      // 如果有信息不存在，则增加一次尝试拉取
      if (!spu || !sku || !stock) {
        unStoreSpu.push({ spuId, index });
      } else {
        dataExtList[index].spu = spu;
        dataExtList[index].sku = sku;
        dataExtList[index].stock = stock;
      }
    });
    log.info(tag, 'fetchCartGoods', 'unstored spu size', unStoreSpu.length);
    if (unStoreSpu.length > 0) {
      const spuList = await services.goods.fetchGoodsSpuListAsync({
        tag,
        trigger,
        idList: unStoreSpu.map(({ spuId }) => spuId),
        disposable,
      });

      // 再次教研信息是否存在，如果不存在，标记为不可用
      unStoreSpu.forEach(({ spuId, index }) => {
        const { skuId, stockId } = dataExtList[index];
        const spu = stores.goods.getSpu(spuId);
        const sku = stores.goods.getSku(spuId, skuId);
        const stock = stores.goods.getStock(spuId, skuId, stockId);
        if (!spu || !sku || !stock) {
          dataExtList[index].unable = true;
          log.info(tag, 'fetchCartGoods', 'unstored spu', spuId, !spu, !sku, !stock);
        } else {
          dataExtList[index].spu = spu;
          dataExtList[index].sku = sku;
          dataExtList[index].stock = stock;
        }
      });
    }

    disposable.checkDisposed();

    // 请求成功，切换选中状态
    callback({ code: 'success', trigger, dataExtList });
    log.info(tag, 'fetchCartGoods result', dataExtList);
  } catch (error) {
    if (error.name === 'TASK_DISPOSABLED') {
      // 判断任务是否被取消
      callback({ code: 'cancelled', trigger });
    } else {
      // 请求失败，切换选中状态
      callback({ code: 'error', error, trigger });
    }
    log.error(tag, '_fetchGoodsSpuListByIdList', error);
  }
}
