import log from '@/common/log/log';
import stockService from './index';
import stockModel from '../../models/stock/index';

export default async function createStock({ tag, spu, sku, stock }) {
  try {
    const id = await stockModel.create({
      tag,
      param: {
        spuId: spu._id,
        skuId: sku._id,
        costPrice: stock.costPrice,
        salePrice: stock.salePrice || stock.originalPrice,
        originalPrice: stock.originalPrice,
        quantity: stock.quantity,
      },
    });
    // 更新草稿ID
    stock._id = id;

    // 更新stock记录，重新拉取新增的stock信息
    const data = await stockService.getStockInfo({
      tag,
      sku,
      _id: id,
    });
    log.info(tag, 'createStockInfo', data);
    return data;
  } catch (error) {
    log.error(tag, 'createStockInfo', error);
    throw error;
  }
}
