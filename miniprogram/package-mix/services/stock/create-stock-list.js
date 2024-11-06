import log from '@/common/log/log';
import stockModel from '../../models/stock/index';

export default async function ({ tag, spu }) {
  const tagExtra = `createStockList-${spu.title}`;
  log.info(tag, tagExtra, 'start create stock');
  // 更新库存信息
  const newStockList =
    spu.skuList // 从skuList中获取新增的sku
      .flatMap((sku) => sku.stockList || [])
      .filter((stock) => stock._id.startsWith('-')) || [];
  if (newStockList.length > 0) {
    try {
      const stockIdList = await stockModel.createMany({
        tag,
        paramList: newStockList.map((stock) => ({
          quantity: stock.quantity,
          costPrice: stock.costPrice,
          originalPrice: stock.originalPrice,
          skuId: stock.skuId,
        })),
      });
      newStockList.forEach((stock, index) => {
        stock._id = stockIdList[index];
      });
      log.info(tag, tagExtra, 'success creat ', newStockList.length, 'stock');
    } catch (error) {
      log.info(tag, tagExtra, 'createStockList error', error);
      throw error;
    }
  } else {
    log.info(tag, tagExtra, 'no new stock');
  }
}
