import log from '@/common/log/log';
import services from '@/services/index';

import { create, createMany } from './create';
import list from './list';
import listBatch from './list-batch';
import update from './update';

export default (function () {
  const tagService = 'stock-services';
  return {
    create,
    createMany,
    list,
    listBatch,
    update,

    createStockList: async function ({ tag, spu }) {
      const tagExtra = `${tagService}-createStockList-${spu.title}`;
      log.info(
        tag,
        tagExtra,
        'start create stock',
        spu.skuList // 从skuList中获取新增的sku
          .flatMap((sku) => sku.stockList),
      );
      // 更新库存信息
      const newStockList =
        spu.skuList // 从skuList中获取新增的sku
          .flatMap((sku) => sku.stockList || [])
          .filter((stock) => stock._id.startsWith('-')) || [];
      if (newStockList.length > 0) {
        try {
          const stockIdList = await services.stock.createMany({
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
    },
  };
})();
