import log from '@/common/log/log';
import stockModel from '../../models/stock/index';

export default async function ({
  tag, //
  stockId,
  quantity,
  costPrice,
  originalPrice,
  salePrice,
}) {
  try {
    const data = await stockModel.update({
      tag,
      _id: stockId,
      quantity,
      costPrice,
      originalPrice,
      salePrice,
    });
    log.info(tag, 'updateStockInfo', data);
    return data;
  } catch (error) {
    log.error(tag, 'updateStockInfo', error);
    throw error;
  }
}
