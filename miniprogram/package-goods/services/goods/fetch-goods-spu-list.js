import log from '@/common/log/log';

import services from '@/services/index';
import goodsModel from '../../models/goods/index';
import goodsStore from '../../stores/goods/index';
import { flow } from 'mobx-miniprogram';

export default function ({ tag, cId, pageNumber, trigger, callback = () => null }) {
  // 发起新的请求并记录任务
  let _task = fetchGoodsSpuListFlow({
    tag,
    cId,
    pageNumber,
    trigger,
    callback,
    _finally: () => {
      _task = null;
    },
  });
  return {
    key: 'fetchGoodsSpuList',
    dispose: () => {
      _task?.cancel();
      _task = null;
    },
  };
}

export const fetchGoodsSpuListFlow = flow(function* ({
  tag,
  cId,
  pageNumber,
  trigger,
  callback,
  _finally,
}) {
  // 请求中，切换选中状态
  callback({ code: 'loading', trigger });
  log.info(tag, '_fetchGoodsSpuList', trigger, cId, pageNumber);

  try {
    const data = yield goodsModel.listSpu({
      tag,
      cId,
      pageNumber,
    });
    const { records: spuList, total } = data;

    // 加载规格信息
    yield Promise.all([
      _handleSpuSpecList({ tag, spuList }),
      services.stock.fetchStockList({ tag, spuList }),
    ]);
    // 拼接spu中的规格信息
    _handleSkuOptionList(spuList);

    // 更新结果到 store 中
    goodsStore.setGoodsSpuListResult({ tag, cId, pageNumber, spuList, total });

    // 请求成功，切换选中状态
    callback({ code: 'success', trigger, spuList, total });
    log.info(tag, '_fetchGoodsSpuList result', spuList.length);
    return data;
  } catch (error) {
    // 判断任务是否被取消
    if (error.message === 'FLOW_CANCELLED') {
      callback({ code: 'cancelled', trigger });
      log.info(tag, '_fetchGoodsSpuList was cancelled');
    } else {
      // 请求失败，切换选中状态
      callback({ code: 'error', error, trigger });
      log.error(tag, '_fetchGoodsSpuList error', error);
    }
  } finally {
    _finally?.();
  }
});

export const _handleSpuSpecList = async function ({ tag, spuList }) {
  if (!spuList || spuList.length <= 0) return;
  // 创建一个 Set 来保存所有的 cId，并去重
  const cIdSet = new Set();
  spuList.forEach(({ cId }) => {
    if (cId) cIdSet.add(cId);
  });
  const cIdList = Array.from(cIdSet);
  const cIdSpecListMap = await services.spec.getSpecListBatch({ tag, cIdList });
  spuList.forEach((spu) => {
    // fixme: spu中，不应该保存 specList，应该通过 cId去 spec store中获取
    spu.specList = cIdSpecListMap.get(spu.cId) || [];
  });
};

export const _handleSkuOptionList = function (spuList) {
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
