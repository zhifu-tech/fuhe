import log from '@/common/log/log';
import stockModel from '../../models/stock/index';

export default async function fetchStockList({ tag, spuList }) {
  log.info(tag, 'fetchSkuStockList', spuList?.length);
  if (!spuList || spuList.length <= 0) return;

  const skuIdList = [];
  spuList.forEach((spu) => {
    spu.skuList.forEach((sku) => {
      skuIdList.push(sku._id);
    });
  });

  const { records: stockList } = await stockModel.listBatch({
    tag,
    skuIdList: skuIdList,
  });

  spuList.forEach((spu) => {
    spu.skuList.forEach((sku) => {
      sku.stockList = [];
      let index = 0;
      // 遍历找到第一个匹配的 skuId
      while (index < stockList.length && stockList[index].skuId !== sku._id) index++;
      if (index >= stockList.length) return;
      const startIndex = index;
      // 添加所有匹配的库存记录
      while (index < stockList.length && stockList[index].skuId === sku._id) {
        sku.stockList.push(stockList[index]);
        index++;
      }
      // 移除已经添加的记录
      skuIdList.splice(startIndex, index - startIndex);
    });
  });
}
