import log from '@/common/log/log';
import stores from '@/stores/index';
import stockModel from '../../models/stock/index';
import { formatStockInfo } from './fetch-stock-list';

export default async function ({ tag, sku, _id }) {
  try {
    const stock = await stockModel.get({ tag, _id });

    formatStockInfo(stock);

    // 新增的stock保存到库存中
    stores.goods.sku.addStock({
      tag,
      sku,
      stock: stock,
    });

    log.info(tag, 'getStockInfo', stock);
    return stock;
  } catch (error) {
    log.error(tag, 'getStockInfo', error);
    throw error;
  }
}
