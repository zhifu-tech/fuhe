import log from '@/common/log/log';
import stockService from '../../services/stock/index';
import stockModel from '../../models/stock/index';

export default async function ({ tag, sku, draft }) {
  try {
    const id = await stockModel.create({
      tag,
      param: {
        skuId: draft.skuId,
        costPrice: draft.costPrice,
        originalPrice: draft.originalPrice,
        quantity: draft.quantity,
      },
    });
    // 更新草稿ID
    draft._id = id;

    // 更新stock记录，重新拉取新增的stock信息
    const data = stockService.getStockInfo({
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
