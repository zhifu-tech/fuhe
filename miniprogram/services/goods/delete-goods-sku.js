import log from '@/common/log/log';
import stores from '@/stores/index';
import models from '@/models/index';

export default async function ({ tag, spuId, skuId }) {
  try {
    await models.goods.skuDelete({ tag, _id: skuId });
    stores.goods.deleteGoodsSku({ tag, spuId, skuId });
    log.info(tag, 'delete sku success');
  } catch (error) {
    log.error(tag, 'delete sku error', error);
    throw error;
  }
}
