import log from '@/common/log/log';
import stockModel from '../../models/stock/index';
import dayjs from 'dayjs';

export default async function fetchStockList({ tag, spuList }) {
  try {
    const skuList = spuList.flatMap((spu) => spu.skuList);
    const { records: stockList } = await stockModel.list({
      tag,
      skuIdList: skuList.map((sku) => sku._id),
    });

    stockList.forEach((stock) => {
      formatStockInfo(stock);
    });

    skuList.forEach((sku) => {
      sku.stockList = [];
      let index = 0;
      // 遍历找到第一个匹配的 skuId
      while (index < stockList.length && stockList[index].skuId !== sku._id) index++;
      if (index >= stockList.length) return;
      // 添加所有匹配的库存记录
      while (index < stockList.length && stockList[index].skuId === sku._id) {
        sku.stockList.push(stockList[index]);
        index++;
      }
    });
    log.info(tag, 'fetchSkuStockList', stockList.length);
  } catch (error) {
    log.error(tag, 'fetchSkuStockList', error);
    throw error;
  }
}

export function formatStockInfo(stock) {
  // 1. 格式化所有的库存时间
  stock.createdAtFormatted = stock.createdAt
    ? dayjs(stock.createdAt).format('YYYY-MM-DD HH:mm')
    : '';
  // 2. 纠正属性
  stock.salePrice = stock.salePrice || 0;
  stock.saleQuantity = stock.saleQuantity || 0;
  stock.costPrice = stock.costPrice || 0;
  stock.originalPrice = stock.originalPrice || 0;
  stock.quantity = stock.quantity || 0;
}
