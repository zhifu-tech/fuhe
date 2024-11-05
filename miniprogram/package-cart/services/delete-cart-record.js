import log from '@/common/log/log';
import cartStore from '../stores/index';
import cartModels from '../models/index';

export default async function deleteCartRecord({ tag, spuId, skuId, stockId }) {
  // 由于数量变更引起的减少，需要查找具有相同{spuId, skuId, stockId, salePrice}的记录
  // 理论上只有一条记录
  const recordList = cartStore.getCartRecordList({ tag, spuId, skuId, stockId });
  if (recordList.length > 0) {
    try {
      const data = await cartModels.deleteMany({
        tag,
        idList: recordList.map((record) => record._id),
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
}
