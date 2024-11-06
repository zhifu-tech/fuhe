import log from '@/common/log/log';

import services from '@/services/index';
import goodsModel from '../../models/goods/index';
import goodsStore from '../../stores/goods/index';
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
    goodsStore.setFetchGoodsSpuListStatus({ code: 'loading', trigger });

    const { records: spuList, total } = yield goodsModel.spuList({
      tag,
      cId,
      pageNumber,
      pageSize: 10,
    });

    // 加载规格信息
    yield Promise.all([
      _handleSpuSpecList({ tag, spuList }),
      services.stock.fetchStockList({ tag, spuList }),
    ]);
    // 拼接spu中的规格信息
    _handleSkuOptionList(spuList);

    // 更新结果到 store 中
    goodsStore.setFetchGoodsSpuListResult({ tag, cId, pageNumber, spuList, total });

    // 请求成功，切换选中状态
    goodsStore.setFetchGoodsSpuListStatus({ code: 'success', trigger });
    log.info(tag, '_fetchGoodsSpuList result', spuList);
  } catch (error) {
    // 判断任务是否被取消
    if (error.message === 'FLOW_CANCELLED') {
      log.info(tag, '_fetchGoodsSpuList was cancelled');
    } else {
      // 请求失败，切换选中状态
      goodsStore.setFetchGoodsSpuListStatus({ code: 'error', error, trigger });
      log.error(tag, '_fetchGoodsSpuList error', error);
    }
  } finally {
    // 重置任务状态
    _fetchGoodsSpuListTask = null;
  }
});

const _handleSpuSpecList = async function ({ tag, spuList }) {
  if (!spuList || spuList.length <= 0) return;
  // 创建一个 Set 来保存所有的 cId，并去重
  const cIdSet = new Set();
  spuList.forEach(({ cId }) => {
    if (cId) cIdSet.add(cId);
  });
  const cIdList = Array.from(cIdSet);
  const cIdSpecListMap = await services.spec.getSpecListBatch({ tag, cIdList });
  spuList.forEach((spu) => {
    spu.specList = cIdSpecListMap.get(spu.cId) || [];
  });
};

const _handleSkuOptionList = function (spuList) {
  spuList.forEach((spu) => {
    spu.specList = spu.specList || [];
    if (!spu.skuList) return;
    if (spu.specList.length === 0) return;
    spu.skuList.forEach((sku) => {
      if (!sku.optionIdList) {
        sku.optionList = [];
        return;
      }
      sku.optionList = sku.optionIdList.map((optionId) => {
        let target = {};
        spu.specList.find((spec) => {
          target = spec.optionList.find((option) => option._id === optionId);
          return target;
        });
        return target || {};
      });
    });
  });
};
