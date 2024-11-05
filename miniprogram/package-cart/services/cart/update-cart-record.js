import log from '@/common/log/log';
import cartStore from '../../stores/index';
import cartModels from '../../models/index';
import cartServices from '../index';

/**
 * 更新cart记录
 * 1. 更改销售价格
 * 2. 更改销售数量
 */
export default async function updateCartRecord({
  tag, //
  spuId,
  skuId,
  stockId,
  salePrice,
  saleQuantity,
}) {
  log.info(tag, 'updateCartRecord', salePrice, saleQuantity);
  if (
    salePrice === undefined || // 价格为undefined，删除记录
    saleQuantity === undefined || // 数量为undefined 或 0，删除记录
    saleQuantity === 0
  ) {
    const res = await cartServices.deleteCartRecord({
      tag,
      spuId,
      skuId,
      stockId,
      salePrice,
    });
    return res;
  }
  // 获取记录列表
  const recordList = cartStore.getCartRecordList({ tag, spuId, skuId, stockId });
  // 如果记录列表为空，说明是新增记录
  if (recordList.length === 0) {
    const res = await cartServices.addCartRecord({
      tag,
      spuId,
      skuId,
      stockId,
      salePrice,
      saleQuantity,
    });
    return res;
  }

  // 有三种更新，新增价格变更、已有价格变更和数量变更
  // 对于价格变更，目前只支持已有价格变更。

  try {
    const data = await cartModels.updateMany({
      tag,
      idList: recordList.map((record) => record._id),
      salePrice,
      saleQuantity,
    });

    // 更新记录列表
    recordList.forEach((record) => {
      cartStore.updateCartRecord({ tag, record, salePrice, saleQuantity });
    });
    log.info(tag, 'updateCartRecord', 'update success!', data);
    return data;
  } catch (error) {
    log.error(tag, 'updateCartRecord', 'update failed!', error);
    throw error;
  }
}
