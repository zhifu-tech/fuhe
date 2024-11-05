import log from '@/common/log/log';
import cartStore from '../stores/index';
import cartModels from '../models/index';
import { flow } from 'mobx-miniprogram';
import { saasId } from '@/common/saas/saas';

let _task = null;
export default async function fetchCartData({ tag, trigger }) {
  log.info(tag, 'fetch-cart-data', trigger);
  if (_task) {
    _task.cancel();
  }
  _task = _fetchCartData({ tag, trigger });
  return _task;
}

const _fetchCartData = flow(function* ({ tag, trigger }) {
  try {
    const data = yield cartModels.all({
      saasId: saasId(),
    });
    log.info(tag, 'fetch-cart-data', data);

    // // 从结果中，提取spuId的列表，然后获取spu信息
    // const spuIdList = data.map((item) => item.spuId);
    // const { spuData } = yield cartModels.spu.all({
    //   spuIdList,
    // });
    // log.info(tag, 'fetch-cart-data', spuData);

    // // 从结果中，提取skuId的列表，然后获取sku信息
    // const skuIdList = data.map((item) => item.skuId);
    // const { skuData } = yield cartModels.sku.all({
    //   skuIdList,
    // });
    // log.info(tag, 'fetch-cart-data', skuData);

    // // 从结果中提取stockId的列表，然后获取stock信息
    // const stockIdList = data.map((item) => item.stockId);
    // const { stockData } = yield cartModels.stock.all({
    //   stockIdList,
    // });
    // log.info(tag, 'fetch-cart-data', stockData);

    // 保存结果到 store 中
    cartStore.setFetchCartData({ tag, ...data });
    // 保存结果到store中
  } catch (error) {
    log.error(tag, 'fetch-cart-data', error);
  }
});
