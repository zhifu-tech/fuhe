import log from '@/common/log/log';
import cartStore from '../../stores/cart/index';
import cartModels from '../../models/cart/index';

export default async function deleteCartRecord({ tag, spuId, skuId, stockId }) {
  // 由于数量变更引起的减少，需要查找具有相同{spuId, skuId, stockId, salePrice}的记录
  // 理论上只有一条记录
  const recordList = cartStore.getCartRecordList({ tag, spuId, skuId, stockId });
  if (recordList.length === 0) {
    log.info(tag, 'deleteCartRecord', 'no record to delete');
    return [];
  }

  try {
    const data = await cartModels.deleteMany({
      tag,
      idList: recordList.map((r) => r._id),
    });

    // 从store中删除记录
    recordList.forEach((record) => {
      cartStore.deleteCartRecord({ tag, record });
    });
    log.info(tag, 'deleteCartRecord', data);
    return recordList;
  } catch (error) {
    log.error(tag, 'deleteCartRecord', error);
    throw error;
  }
}
