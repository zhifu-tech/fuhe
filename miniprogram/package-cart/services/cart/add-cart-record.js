import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import cartModels from '../../models/index';
import cartServices from '../index';

export default async function addCardRecord({
  tag,
  spuId,
  skuId,
  stockId,
  salePrice,
  saleQuantity,
}) {
  try {
    const id = await cartModels.create({
      tag,
      saasId: saasId(),
      spuId,
      skuId,
      stockId,
      salePrice,
      saleQuantity,
    });

    // 拉取新增记录，并更新store
    cartServices.getCartRecord({ tag, _id: id, useStore: false });
    log.info(tag, 'addCardRecord', 'create', id);
    return id;
  } catch (error) {
    log.error(tag, 'addCardRecord', error);
    throw error;
  }
}
