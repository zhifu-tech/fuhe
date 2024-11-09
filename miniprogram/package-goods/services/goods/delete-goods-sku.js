import log from '@/common/log/log';
import stores from '@/stores/index';
import goodsModel from '../../models/goods/index';

export default async function ({ tag, spuId, skuId }) {
  try {
    await goodsModel.skuDelete({ tag, _id: skuId });

    stores.goods.deleteGoodsSku({ tag, spuId, skuId });

    log.info(tag, 'delete sku success');
  } catch (error) {
    log.error(tag, 'delete sku error', error);
    throw error;
  }
}
