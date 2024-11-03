import log from '@/common/log/log';
import stores from '@/stores/index';
import models from '@/models/index';
import { flow } from 'mobx-miniprogram';

let _fetchGoodsSpuListTask = null; // 记录当前正在进行的请求

export default function ({ tag, cId, pageNumber, trigger }) {
  // 取消上一次的请求
  if (_fetchGoodsSpuListTask) {
    _fetchGoodsSpuListTask.cancel();
  }

  // 发起新的请求并记录任务
  _fetchGoodsSpuListTask = _fetchGoodsSpuList({
    tag,
    cId,
    pageNumber,
    trigger,
  });
}

const _fetchGoodsSpuList = flow(function* ({ tag, cId, pageNumber, trigger }) {
  log.info(tag, '_fetchGoodsSpuList', trigger, cId, pageNumber);
  try {
    // 请求中，切换选中状态
    stores.goods.setFetchGoodsSpuListStatus({ code: 'loading', trigger });

    const { records: spuList, total } = yield models.goods.spuList({
      tag,
      cId,
      pageNumber,
      pageSize: 10,
    });

    // 更新结果到 store 中
    stores.goods.setFetchGoodsSpuListResult({ tag, cId, pageNumber, spuList, total });

    // 请求成功，切换选中状态
    stores.goods.setFetchGoodsSpuListStatus({ code: 'success', trigger });
    log.info(tag, '_fetchGoodsSpuList result', spuList);
  } catch (error) {
    // 判断任务是否被取消
    if (error.message === 'FLOW_CANCELLED') {
      log.info(tag, '_fetchGoodsSpuList was cancelled');
    } else {
      // 请求失败，切换选中状态
      stores.goods.setFetchGoodsSpuListStatus({ code: 'error', error, trigger });
      log.error(tag, '_fetchGoodsSpuList error', error);
    }
  } finally {
    // 重置任务状态
    _fetchGoodsSpuListTask = null;
  }
});
