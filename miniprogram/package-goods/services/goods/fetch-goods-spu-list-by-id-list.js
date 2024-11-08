import log from '@/common/log/log';

import services from '@/services/index';
import goodsModel from '../../models/goods/index';
import goodsStore from '../../stores/goods/index';
import Disposable from '@/common/disposable/index';

import { _handleSpuSpecList, _handleSkuOptionList } from './fetch-goods-spu-list';

export default function fetchGoodsSpuListByIdList({ tag, idList, trigger, callback }) {
  const disposable = new Disposable();

  // 发起新的请求并记录任务
  fetchGoodsSpuListAsync({ tag, idList, trigger, callback, disposable });
  return disposable;
}

export async function fetchGoodsSpuListAsync({
  tag,
  idList,
  trigger,
  disposable,
  callback = () => null,
}) {
  log.info(tag, '_fetchGoodsSpuListByIdList', trigger, idList.length);
  try {
    // 请求中，切换选中状态
    callback({ code: 'loading', trigger });

    // 这才用一次拉取所有请求，当数据量比较大时，会非常慢。但当前满足，后续有必要时再优化
    const { records: spuList, total } = await goodsModel.spuListByIdList({
      tag,
      idList,
    });

    disposable.checkDisposed();

    // 加载规格信息
    await Promise.all([
      _handleSpuSpecList({ tag, spuList }),
      services.stock.fetchStockList({ tag, spuList }),
    ]);

    disposable.checkDisposed();

    // 拼接spu中的规格信息
    _handleSkuOptionList(spuList);

    // 更新结果到 store 中
    goodsStore.setGoodsSpuListResultByIdList({ tag, spuList });

    // 请求成功，切换选中状态
    callback({ code: 'success', trigger, spuList, total });
    log.info(tag, '_fetchGoodsSpuListByIdList result', spuList);
    return spuList;
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
