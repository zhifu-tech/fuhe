import log from '@/common/log/log';
import stores from '@/stores/index';
import models from '@/models/index';

let _fetchGoodsSpuListTask = null; // 记录当前正在进行的请求

export default function ({ tag, cId, pageNumber, trigger }) {
  // 目前只支持的单一tab的显示和处理，所以需要取消上一次的请求
  if (_fetchGoodsSpuListTask) {
    _fetchGoodsSpuListTask.cancel();
  }
  _fetchGoodsSpuListTask = _fetchGoodsSpuList({
    tag,
    cId,
    pageNumber,
    trigger,
  });
  return _fetchGoodsSpuListTask;
}

async function _fetchGoodsSpuList({ tag, cId, pageNumber, trigger }) {
  log.info(tag, '_fetchGoodsSpuList', trigger, cId, pageNumber);
  try {
    // 请求中，切换选中状态
    this.fetchGoodsSpuListStatus = { code: 'loading', trigger };
    stores.goods.setFetchGoodsSpuListStatus({ code: 'loading', trigger });
    const { records: spuList, total } = await models.goods.spuList({
      tag,
      cId,
      pageNumber,
      pageSize: 10,
    });

    // 更新结果到store中
    stores.goods.setFetchGoodsSpuListResult({ tag, cId, pageNumber, spuList, total });
    // 请求成功，切换选中状态
    stores.goods.setFetchGoodsSpuListStatus({ code: 'success', trigger });
    log.info(tag, '_fetchGoodsSpuList result', spuList);
  } catch (error) {
    // 请求失败，切换选中状态
    stores.goods.setFetchGoodsSpuListStatus({ code: 'error', error, trigger });
    log.error(tag, '_fetchGoodsSpuList', error);
  } finally {
    // 重置任务状态
    _fetchGoodsSpuListTask = null;
  }
}
