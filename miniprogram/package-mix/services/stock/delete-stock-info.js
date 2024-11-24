import log from '@/common/log/log';
import stores from '@/stores/index';
import stockModel from '../../models/stock/index';

export default async function deleteStockInfo({ tag, sku, _id }) {
  try {
    const res = await stockModel.deleteStock({ tag, _id });

    // 新增的stock保存到库存中
    stores.goods.sku.removeStock({
      tag,
      sku,
      stockId: _id,
    });

    log.info(tag, 'deleteStockInfo', _id);
    return stock;
  } catch (error) {
    log.error(tag, 'deleteStockInfo', error);
    throw error;
  }
}
