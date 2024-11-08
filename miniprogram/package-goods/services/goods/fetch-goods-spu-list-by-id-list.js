import log from '@/common/log/log';

import services from '@/services/index';
import goodsModel from '../../models/goods/index';
import goodsStore from '../../stores/goods/index';
import { flow } from 'mobx-miniprogram';

import { _handleSpuSpecList, _handleSkuOptionList } from './fetch-goods-spu-list';

let _task = null; // 记录当前正在进行的请求

export default function ({ tag, idList, trigger, callback = () => null }) {
  // 取消上一次的请求
  if (_task) {
    _task.cancel();
  }
  // 发起新的请求并记录任务
  _task = _fetchGoodsSpuList({ tag, idList, trigger, callback });
  return {
    dispose: () => {
      _task?.cancel();
      _task = null;
    },
  };
}

const _fetchGoodsSpuList = flow(function* ({ tag, idList, trigger, callback }) {
  log.info(tag, '_fetchGoodsSpuListByIdList', trigger, idList.length);
  try {
    // 请求中，切换选中状态
    callback({ code: 'loading', trigger });

    // 这才用一次拉取所有请求，当数据量比较大时，会非常慢。但当前满足，后续有必要时再优化
    const { records: spuList, total } = yield goodsModel.spuListByIdList({
      tag,
      idList,
    });

    // 加载规格信息
    yield Promise.all([
      _handleSpuSpecList({ tag, spuList }),
      services.stock.fetchStockList({ tag, spuList }),
    ]);
    // 拼接spu中的规格信息
    _handleSkuOptionList(spuList);

    // 更新结果到 store 中
    goodsStore.setGoodsSpuListResultByIdList({ tag, spuList });

    // 请求成功，切换选中状态
    callback({ code: 'success', trigger, spuList, total });
    log.info(tag, '_fetchGoodsSpuListByIdList result', spuList);
  } catch (error) {
    // 判断任务是否被取消
    if (error.message === 'FLOW_CANCELLED') {
      callback({ code: 'cancelled', trigger });
      log.info(tag, '_fetchGoodsSpuListByIdList was cancelled');
    } else {
      // 请求失败，切换选中状态
      callback({ code: 'error', error, trigger });
      log.error(tag, '_fetchGoodsSpuListByIdList error', error);
    }
  } finally {
    // 重置任务状态
    _task = null;
  }
});
