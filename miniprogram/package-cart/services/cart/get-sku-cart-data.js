import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';
import cartModels from '../../models/cart/index';
import cartServices from './index';

/** 获取某种规格商品的库存数据 */
export async function getSkuCartData({ tag, sku }) {
  log.info(tag, 'get-sku-cart-data', sku);
}
